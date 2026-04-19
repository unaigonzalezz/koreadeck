import streamDeck, {
  action,
  DialAction,
  KeyAction,
  KeyDownEvent,
  SingletonAction,
  WillAppearEvent,
} from "@elgato/streamdeck";
import type { JsonObject } from "@elgato/utils";
import { DEFAULT_TIMEOUT, KOREADER_PORT } from "../../config/koreader";
import { toNumber } from "../../lib/action-utils/action-utils";
import { callKoreader } from "../../lib/koreader-client";
import { KoreaderGlobalSettings } from "../../types/KoreaderGlobalSettings";

type FrontlightResponse = {
  result?: boolean;
};

const updateFrontlightState = async (
  actionInstance: DialAction<JsonObject> | KeyAction<JsonObject>,
  ip: string,
  port: number,
  timeoutMs: number,
): Promise<boolean> => {
  const response = await callKoreader<FrontlightResponse>(
    {
      ip,
      port,
      path: `/koreader/device/powerd/isFrontlightOnHW/`,
    },
    timeoutMs,
  );

  if (response.ok && response.data?.result !== undefined && "setState" in actionInstance && actionInstance.setState) {
    await actionInstance.setState(response.data.result ? 1 : 0);
    return true;
  }
  return false;
};

@action({ UUID: "com.unai-gonzalez.koreadeck.toggle-frontlight" })
export class KoreaderToggleFrontlight extends SingletonAction {
  override async onWillAppear(ev: WillAppearEvent): Promise<void> {
    const globalSettings = await streamDeck.settings.getGlobalSettings<KoreaderGlobalSettings>();
    const ip = globalSettings.ip?.trim() || "";
    const timeoutMs = toNumber(globalSettings.timeoutMs, DEFAULT_TIMEOUT);
    const port = toNumber(globalSettings.port, KOREADER_PORT);

    await updateFrontlightState(ev.action, ip, port, timeoutMs);
  }

  override async onKeyDown(ev: KeyDownEvent): Promise<void> {
    const globalSettings = await streamDeck.settings.getGlobalSettings<KoreaderGlobalSettings>();
    const ip = globalSettings.ip?.trim() || "";
    const timeoutMs = toNumber(globalSettings.timeoutMs, DEFAULT_TIMEOUT);
    const port = toNumber(globalSettings.port, KOREADER_PORT);

    if (!ip) {
      await ev.action.setImage("imgs/actions/common/configErr.png");
      return;
    }

    const response = await callKoreader(
      {
        ip,
        port,
        path: `/koreader/event/ToggleFrontlight`,
      },
      timeoutMs,
    );

    if (!response.ok) {
      await ev.action.showAlert();
    } else {
      await ev.action.showOk();
      await updateFrontlightState(ev.action, ip, port, timeoutMs);
    }

    await ev.action.setTitle("");
  }
}
