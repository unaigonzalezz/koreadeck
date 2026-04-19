import streamDeck, { action, KeyDownEvent, SingletonAction, WillAppearEvent } from "@elgato/streamdeck";
import { DEFAULT_TIMEOUT, KOREADER_PORT } from "../../config/koreader";
import { toNumber } from "../../lib/action-utils/action-utils";
import { ensureConfigServer } from "../../lib/config-server";
import { KoreaderGlobalSettings } from "../../types/KoreaderGlobalSettings";

@action({ UUID: "com.unai-gonzalez.koreadeck.set-config" })
export class KoreaderConfig extends SingletonAction<KoreaderGlobalSettings> {
  override async onWillAppear(ev: WillAppearEvent<KoreaderGlobalSettings>): Promise<void> {
    const globalSettings = await streamDeck.settings.getGlobalSettings<KoreaderGlobalSettings>();
    const ip = globalSettings.ip?.trim();

    if (ip) {
      await ev.action?.setImage("imgs/actions/config/configured.png");
    } else {
      await ev.action?.setImage("imgs/actions/config/key.png");
    }
  }

  override async onKeyDown(ev: KeyDownEvent<KoreaderGlobalSettings>): Promise<void> {
    const { settings } = ev.payload;
    const ip = settings.ip?.trim();

    if (ip) {
      const port = toNumber(settings.port, KOREADER_PORT);
      const timeoutMs = toNumber(settings.timeoutMs, DEFAULT_TIMEOUT);

      const payload: KoreaderGlobalSettings = {
        ip,
        port,
        timeoutMs,
      };

      await streamDeck.settings.setGlobalSettings(payload);
      await ev.action?.setImage("imgs/actions/config/configured.png");
      await ev.action.showOk();
    }

    try {
      const url = await ensureConfigServer();
      await streamDeck.system.openUrl(url);
    } catch {
      await ev.action.showAlert();
    }
  }
}
