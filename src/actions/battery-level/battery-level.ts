import streamDeck, {
  action,
  DidReceiveSettingsEvent,
  KeyDownEvent,
  SingletonAction,
  WillAppearEvent,
} from "@elgato/streamdeck";
import { DEFAULT_TIMEOUT, KOREADER_PORT } from "../../config/koreader";
import { toNumber } from "../../lib/action-utils/action-utils";
import { callKoreader } from "../../lib/koreader-client";
import { KoreaderGlobalSettings } from "../../types/KoreaderGlobalSettings";

type BatteryLevelSettings = {
  showPercentage?: boolean;
};

const batteryImage = (capacity: number): string => {
  if (capacity <= 5) return "imgs/actions/battery-level/key-empty.png";
  if (capacity <= 20) return "imgs/actions/battery-level/key-0.png";
  if (capacity <= 40) return "imgs/actions/battery-level/key-1.png";
  if (capacity <= 60) return "imgs/actions/battery-level/key-2.png";
  if (capacity <= 80) return "imgs/actions/battery-level/key-3.png";
  return "imgs/actions/battery-level/key-4.png";
};

const fetchAndDisplay = async (
  actionInstance: {
    setImage(path: string): Promise<void>;
    setTitle(title: string): Promise<void>;
    showAlert(): Promise<void>;
  },
  ip: string,
  port: number,
  timeoutMs: number,
  showPercentage: boolean,
): Promise<void> => {
  const chargingResponse = await callKoreader<boolean>(
    { ip, port, path: `/koreader/device/powerd/isChargingHW/` },
    timeoutMs,
  );

  if (!chargingResponse.ok || chargingResponse.data == null) {
    await actionInstance.showAlert();
    return;
  }

  if (chargingResponse.data === true) {
    const capacityResponse = await callKoreader<number>(
      { ip, port, path: `/koreader/device/powerd/getCapacity/` },
      timeoutMs,
    );
    const capacity = capacityResponse.ok && capacityResponse.data != null ? capacityResponse.data : null;
    await actionInstance.setImage("imgs/actions/battery-level/key-charging.png");
    await actionInstance.setTitle(showPercentage && capacity != null ? `${capacity}%` : "");
    return;
  }

  const response = await callKoreader<number>({ ip, port, path: `/koreader/device/powerd/getCapacity/` }, timeoutMs);

  if (!response.ok || response.data == null) {
    await actionInstance.showAlert();
    return;
  }

  await actionInstance.setImage(batteryImage(response.data));
  await actionInstance.setTitle(showPercentage ? `${response.data}%` : "");
};

@action({ UUID: "com.unai-gonzalez.koreadeck.battery-level" })
export class KoreaderBatteryLevel extends SingletonAction<BatteryLevelSettings> {
  override async onWillAppear(ev: WillAppearEvent<BatteryLevelSettings>): Promise<void> {
    const globalSettings = await streamDeck.settings.getGlobalSettings<KoreaderGlobalSettings>();
    const ip = globalSettings.ip?.trim() || "";
    const timeoutMs = toNumber(globalSettings.timeoutMs, DEFAULT_TIMEOUT);
    const port = toNumber(globalSettings.port, KOREADER_PORT);

    const showPercentage = ev.payload.settings.showPercentage ?? true;
    await fetchAndDisplay(ev.action, ip, port, timeoutMs, showPercentage);
  }

  override async onKeyDown(ev: KeyDownEvent<BatteryLevelSettings>): Promise<void> {
    const globalSettings = await streamDeck.settings.getGlobalSettings<KoreaderGlobalSettings>();
    const ip = globalSettings.ip?.trim() || "";
    const timeoutMs = toNumber(globalSettings.timeoutMs, DEFAULT_TIMEOUT);
    const port = toNumber(globalSettings.port, KOREADER_PORT);

    if (!ip) {
      await ev.action.setImage("imgs/actions/common/configErr.png");
      return;
    }

    const showPercentage = ev.payload.settings.showPercentage ?? true;
    await fetchAndDisplay(ev.action, ip, port, timeoutMs, showPercentage);
  }

  override async onDidReceiveSettings(ev: DidReceiveSettingsEvent<BatteryLevelSettings>): Promise<void> {
    const globalSettings = await streamDeck.settings.getGlobalSettings<KoreaderGlobalSettings>();
    const ip = globalSettings.ip?.trim();
    const timeoutMs = toNumber(globalSettings.timeoutMs, DEFAULT_TIMEOUT);
    const port = toNumber(globalSettings.port, KOREADER_PORT);

    if (!ip) {
      await ev.action.setImage("imgs/actions/common/configErr.png");
      return;
    }

    const showPercentage = ev.payload.settings.showPercentage ?? true;
    await fetchAndDisplay(ev.action, ip, port, timeoutMs, showPercentage);
  }
}
