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

type KoreaderFrontlightBrightnessSettings = {
  mode?: "up" | "down" | "custom";
  customDelta?: number | string;
};

const clampDelta = (value: number): number => Math.max(0, Math.min(24, value));

const resolveDelta = (settings: KoreaderFrontlightBrightnessSettings): number => {
  switch (settings.mode) {
    case "up":
      return 1;
    case "down":
      return -1;
    case "custom":
      return toNumber(settings.customDelta, 1);
    default:
      return 1;
  }
};

const resolveTitle = (settings: KoreaderFrontlightBrightnessSettings): string => {
  if (settings.mode === "custom") {
    return `${resolveDelta(settings)}`;
  }

  return "";
};

const resolveImage = (settings: KoreaderFrontlightBrightnessSettings): string => {
  const delta = resolveDelta(settings);
  if (settings.mode === "down" || delta < 0) {
    return "imgs/actions/frontlight-brightness/decrease.png";
  }
  return "imgs/actions/frontlight-brightness/increase.png";
};

const updateActionDisplay = async (
  actionInstance: {
    setTitle: (title: string) => Promise<void> | void;
    setImage?: (image: string) => Promise<void> | void;
  },
  settings: KoreaderFrontlightBrightnessSettings,
): Promise<void> => {
  await actionInstance.setTitle(resolveTitle(settings));
  if (actionInstance.setImage) {
    await actionInstance.setImage(resolveImage(settings));
  }
};

@action({ UUID: "com.unai-gonzalez.koreadeck.set-frontlight-brightness" })
export class KoreaderSetFrontlightBrightness extends SingletonAction<KoreaderFrontlightBrightnessSettings> {
  override onWillAppear(ev: WillAppearEvent<KoreaderFrontlightBrightnessSettings>): void | Promise<void> {
    updateActionDisplay(ev.action, ev.payload.settings);
  }

  override onDidReceiveSettings(
    ev: DidReceiveSettingsEvent<KoreaderFrontlightBrightnessSettings>,
  ): void | Promise<void> {
    updateActionDisplay(ev.action, ev.payload.settings);
  }

  override async onKeyDown(ev: KeyDownEvent<KoreaderFrontlightBrightnessSettings>): Promise<void> {
    const { settings } = ev.payload;
    const delta = resolveDelta(settings);
    const magnitude = clampDelta(Math.abs(delta));

    const globalSettings = await streamDeck.settings.getGlobalSettings<KoreaderGlobalSettings>();
    const ip = globalSettings.ip?.trim();
    const timeoutMs = toNumber(globalSettings.timeoutMs, DEFAULT_TIMEOUT);
    const port = toNumber(globalSettings.port, KOREADER_PORT);

    if (!ip) {
      await ev.action.setImage("imgs/actions/common/configErr.png");
      return;
    }

    if (magnitude === 0) {
      await ev.action.showOk();
      await updateActionDisplay(ev.action, settings);
      return;
    }

    const path = delta < 0 ? "DecreaseFlIntensity" : "IncreaseFlIntensity";

    const response = await callKoreader(
      {
        ip,
        port,
        path: `/koreader/event/${path}/${magnitude}`,
      },
      timeoutMs,
    );

    if (!response.ok) {
      await ev.action.showAlert();
    } else {
      await ev.action.showOk();
    }

    await updateActionDisplay(ev.action, settings);
  }
}
