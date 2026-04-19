import streamDeck, {
  action,
  DidReceiveSettingsEvent,
  KeyDownEvent,
  SingletonAction,
  WillAppearEvent,
  WillDisappearEvent,
} from "@elgato/streamdeck";
import { bumpScreenRefreshToken, registerScreenWatcher, unregisterScreenWatcher } from "../../lib/screen-refresh";
import { ensureScreenServer } from "../../lib/screen-server";
import { KoreaderGlobalSettings } from "../../types/KoreaderGlobalSettings";

@action({ UUID: "com.unai-gonzalez.koreadeck.screen-preview" })
export class KoreaderScreenPreview extends SingletonAction {
  override onWillAppear(ev: WillAppearEvent): void {
    registerScreenWatcher(ev.action.id, ev.payload.settings);
  }

  override onDidReceiveSettings(ev: DidReceiveSettingsEvent): void {
    registerScreenWatcher(ev.action.id, ev.payload.settings);
  }

  override onWillDisappear(ev: WillDisappearEvent): void {
    unregisterScreenWatcher(ev.action.id);
  }

  override async onKeyDown(ev: KeyDownEvent): Promise<void> {
    const globalSettings = await streamDeck.settings.getGlobalSettings<KoreaderGlobalSettings>();
    const ip = globalSettings.ip?.trim();

    if (!ip) {
      await ev.action.setImage("imgs/actions/common/configErr.png");
      return;
    }

    try {
      const url = await ensureScreenServer();
      await streamDeck.system.openUrl(url);
      bumpScreenRefreshToken();
      await ev.action.showOk();
    } catch {
      await ev.action.showAlert();
    }

    await ev.action.setTitle("");
  }
}
