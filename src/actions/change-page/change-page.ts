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
import { ensureBookOpen } from "../../lib/koreader-guards";
import { KoreaderGlobalSettings } from "../../types/KoreaderGlobalSettings";

type KoreaderGotoViewRelSettings = {
  mode?: "prev" | "next" | "prev10" | "next10" | "custom";
  customDelta?: number | string;
};

const resolveDelta = (settings: KoreaderGotoViewRelSettings): number => {
  switch (settings.mode) {
    case "prev":
      return -1;
    case "next":
      return 1;
    case "prev10":
      return -10;
    case "next10":
      return 10;
    case "custom":
      return toNumber(settings.customDelta, 1);
    default:
      return 1;
  }
};

const resolveIcon = (mode?: KoreaderGotoViewRelSettings["mode"]): string => {
  switch (mode) {
    case "prev":
      return "imgs/actions/view/prev.png";
    case "next":
      return "imgs/actions/view/next.png";
    case "prev10":
      return "imgs/actions/view/prev10.png";
    case "next10":
      return "imgs/actions/view/next10.png";
    case "custom":
      return "imgs/actions/common/bg.png";
    default:
      return "imgs/actions/view/next.png";
  }
};

const updateActionDisplay = async (
  actionInstance: {
    setTitle: (title: string) => Promise<void> | void;
    setImage: (image: string) => Promise<void> | void;
  },
  settings: KoreaderGotoViewRelSettings,
): Promise<void> => {
  const delta = resolveDelta(settings);
  const icon = resolveIcon(settings.mode);

  if (settings.mode == "custom") {
    await actionInstance.setTitle(delta > 0 ? `+${delta}` : `${delta}`);
  } else {
    await actionInstance.setTitle("");
  }

  await actionInstance.setImage(icon);
};

@action({ UUID: "com.unai-gonzalez.koreadeck.change-page" })
export class KoreaderGotoViewRel extends SingletonAction<KoreaderGotoViewRelSettings> {
  override onWillAppear(ev: WillAppearEvent<KoreaderGotoViewRelSettings>): void | Promise<void> {
    updateActionDisplay(ev.action, ev.payload.settings);
  }

  override onDidReceiveSettings(ev: DidReceiveSettingsEvent<KoreaderGotoViewRelSettings>): void | Promise<void> {
    updateActionDisplay(ev.action, ev.payload.settings);
  }

  override async onKeyDown(ev: KeyDownEvent<KoreaderGotoViewRelSettings>): Promise<void> {
    const { settings } = ev.payload;
    const delta = resolveDelta(settings);

    const globalSettings = await streamDeck.settings.getGlobalSettings<KoreaderGlobalSettings>();
    const ip = globalSettings.ip?.trim();
    const timeoutMs = toNumber(globalSettings.timeoutMs, DEFAULT_TIMEOUT);
    const port = toNumber(globalSettings.port, KOREADER_PORT);

    if (!ip) {
      await ev.action.setImage("imgs/actions/common/configErr.png");
      return;
    }

    const hasOpenBook = await ensureBookOpen(ip, port, timeoutMs);

    if (!hasOpenBook) {
      await ev.action.setImage("imgs/actions/common/openBook.png");
      return;
    } else {
      await ev.action.setImage(resolveIcon(settings.mode));
    }

    const response = await callKoreader(
      {
        ip,
        port,
        path: `/koreader/event/GotoViewRel/${delta}`,
      },
      timeoutMs,
    );

    if (!response.ok) {
      await ev.action.showAlert();
    } else {
      await ev.action.showOk();
    }

    if (settings.mode == "custom") {
      await ev.action.setTitle(delta > 0 ? `+${delta}` : `${delta}`);
    }

    await ev.action.setImage(resolveIcon(settings.mode));
  }
}
