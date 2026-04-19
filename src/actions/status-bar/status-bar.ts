import streamDeck, { action, KeyDownEvent, SingletonAction } from "@elgato/streamdeck";
import { DEFAULT_TIMEOUT, KOREADER_PORT } from "../../config/koreader";
import { toNumber } from "../../lib/action-utils/action-utils";
import { callKoreader } from "../../lib/koreader-client";
import { ensureBookOpen } from "../../lib/koreader-guards";
import { KoreaderGlobalSettings } from "../../types/KoreaderGlobalSettings";

@action({ UUID: "com.unai-gonzalez.koreadeck.status-bar" })
export class KoreaderStatusBar extends SingletonAction {
  override async onKeyDown(ev: KeyDownEvent): Promise<void> {
    const globalSettings = await streamDeck.settings.getGlobalSettings<KoreaderGlobalSettings>();
    const ip = globalSettings.ip?.trim();
    const timeoutMs = toNumber(globalSettings.timeoutMs, DEFAULT_TIMEOUT);
    const port = toNumber(globalSettings.port, KOREADER_PORT);

    if (!ip) {
      await ev.action.setImage("imgs/actions/common/configErr.png");
      return;
    } else {
      const hasOpenBook = await ensureBookOpen(ip, port, timeoutMs);

      if (!hasOpenBook) {
        await ev.action.setImage("imgs/actions/common/openBook.png");
        return;
      } else {
        const response = await callKoreader(
          {
            ip,
            port,
            path: `/koreader/event/ToggleFooterMode`,
          },
          timeoutMs,
        );

        if (!response.ok) {
          await ev.action.showAlert();
        } else {
          await ev.action.showOk();
        }
      }

      await ev.action.setTitle("");
    }
  }
}
