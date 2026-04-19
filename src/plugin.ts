import streamDeck from "@elgato/streamdeck";
import { KoreaderGotoViewRel } from "./actions/change-page/change-page";
import { GetBookInfo } from "./actions/get-book-info/get-book-info";
import { KoreaderConfig } from "./actions/koreader-set-config/koreader-set-config";
import { KoreaderScreenPreview } from "./actions/screen-preview/screen-preview";
import { KoreaderSetFrontlightBrightness } from "./actions/set-frontlight-brightness/set-frontlight-brightness";
import { KoreaderToggleBookmarkCurrentPage } from "./actions/toggle-bookmark-current-page/toggle-bookmark-current-page";
import { KoreaderToggleFrontlight } from "./actions/toggle-frontlight/toggle-frontlight";
import { KoreaderToggleScreenMode } from "./actions/toggle-screen-mode/toggle-screen-mode";
import { KoreaderShowBookmarks } from "./actions/view-bookmarks/view-bookmarks";
import { bumpScreenRefreshToken, shouldRefreshForAction } from "./lib/screen-refresh";
import { KoreaderTakeScreenshot } from "./actions/take-screenshot/take-screenshot";
import { KoreaderOpenLastDocument } from "./actions/open-last-document/open-last-document";
import { KoreaderExitKoreader } from "./actions/exit-koreader/exit-koreader";
import { KoreaderRestartKoreader } from "./actions/restart-koreader/restart-koreader";
import { KoreaderChangeOrientation } from "./actions/change-orientation/change-orientation";
import { KoreaderBatteryLevel } from "./actions/battery-level/battery-level";
import { KoreaderReaderSettings } from "./actions/reader-settings/reader-settings";
import { KoreaderStatusBar } from "./actions/status-bar/status-bar";

streamDeck.logger.setLevel("trace");

streamDeck.actions.registerAction(new KoreaderConfig());
streamDeck.actions.registerAction(new GetBookInfo());
streamDeck.actions.registerAction(new KoreaderGotoViewRel());
streamDeck.actions.registerAction(new KoreaderToggleScreenMode());
streamDeck.actions.registerAction(new KoreaderShowBookmarks());
streamDeck.actions.registerAction(new KoreaderToggleFrontlight());
streamDeck.actions.registerAction(new KoreaderToggleBookmarkCurrentPage());
streamDeck.actions.registerAction(new KoreaderSetFrontlightBrightness());
streamDeck.actions.registerAction(new KoreaderScreenPreview());
streamDeck.actions.registerAction(new KoreaderTakeScreenshot());
streamDeck.actions.registerAction(new KoreaderOpenLastDocument());
streamDeck.actions.registerAction(new KoreaderExitKoreader());
streamDeck.actions.registerAction(new KoreaderRestartKoreader());
streamDeck.actions.registerAction(new KoreaderChangeOrientation());
streamDeck.actions.registerAction(new KoreaderBatteryLevel());
streamDeck.actions.registerAction(new KoreaderReaderSettings());
streamDeck.actions.registerAction(new KoreaderStatusBar());

streamDeck.actions.onKeyDown((ev) => {
  if (shouldRefreshForAction(ev.action.manifestId)) {
    bumpScreenRefreshToken();
  }
});

streamDeck.connect();
