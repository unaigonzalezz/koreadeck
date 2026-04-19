import streamDeck, {
  action,
  DidReceiveSettingsEvent,
  KeyDownEvent,
  SingletonAction,
  WillAppearEvent,
} from "@elgato/streamdeck";
import { DEFAULT_TIMEOUT, KOREADER_PORT } from "../../config/koreader";
import { toNumber } from "../../lib/action-utils/action-utils";
import { fetchBookCoverUrl, fetchImageAsBase64 } from "../../lib/google-books-client/google-books-client";
import { callKoreader } from "../../lib/koreader-client";
import { ensureBookOpen } from "../../lib/koreader-guards";
import { fetchOpenLibraryCoverUrl } from "../../lib/open-library-client/open-library-client";
import { KoreaderGlobalSettings } from "../../types/KoreaderGlobalSettings";
import { buildBookImage, resolveOverlay } from "./book-svg";

type GetBookInfoSettings = {
  displayInfo?: "page" | "title" | "author" | "series" | "none";
};

type BookProps = {
  title?: string;
  authors?: string;
  series?: string;
  series_index?: number;
  language?: string;
  keywords?: string;
  description?: string;
  identifiers?: string;
};

type ActionLike = {
  setImage: (image: string) => Promise<void> | void;
  setTitle: (title: string) => Promise<void> | void;
  showOk?: () => Promise<void> | void;
  showAlert?: () => Promise<void> | void;
};

const logger = streamDeck.logger.createScope("GetBookInfo");

function extractNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number") return value;
  if (Array.isArray(value) && typeof value[0] === "number") return value[0];
  return fallback;
}

async function resolveCoverDataUrl(props: BookProps, timeoutMs: number): Promise<string | null> {
  if (!props.title) return null;

  const extra = timeoutMs + 3000;
  const title = props.title;
  const authors = props.authors ?? "";

  try {
    const coverUrl = await fetchOpenLibraryCoverUrl(title, authors, extra);
    if (coverUrl) {
      const dataUrl = await fetchImageAsBase64(coverUrl, extra);
      if (dataUrl) return dataUrl;
    }
  } catch (err) {
    logger.warn("Failed to fetch cover from Open Library:", err);
  }

  try {
    const coverUrl = await fetchBookCoverUrl(title, authors, extra);
    if (coverUrl) {
      const dataUrl = await fetchImageAsBase64(coverUrl, extra);
      if (dataUrl) return dataUrl;
    }
  } catch (err) {
    logger.warn("Failed to fetch cover from Google Books:", err);
  }

  return null;
}

async function updateBookDisplay(ev: ActionLike, settings: GetBookInfoSettings): Promise<void> {
  const rawSettings = await streamDeck.settings.getGlobalSettings<KoreaderGlobalSettings>();
  const globalSettings: KoreaderGlobalSettings = rawSettings ?? {};

  const ip = globalSettings.ip?.trim();
  const timeoutMs = toNumber(globalSettings.timeoutMs, DEFAULT_TIMEOUT);
  const port = toNumber(globalSettings.port, KOREADER_PORT);

  if (!ip) {
    return;
  }

  const hasOpenBook = await ensureBookOpen(ip, port, timeoutMs);
  if (!hasOpenBook) {
    await ev.setImage("imgs/actions/common/openBook.png");
    await ev.setTitle("");
    return;
  }

  const [propsRes, pageRes, totalPagesRes] = await Promise.all([
    callKoreader<BookProps[]>({ ip, port, path: "/koreader/ui/document/getProps/" }, timeoutMs),
    callKoreader<unknown>({ ip, port, path: "/koreader/ui/getCurrentPage/" }, timeoutMs),
    callKoreader<unknown>({ ip, port, path: "/koreader/ui/document/getNumberOfPages/" }, timeoutMs),
  ]);

  logger.debug(`getProps ok=${propsRes.ok} data=${JSON.stringify(propsRes.data)}`);
  logger.debug(`getCurrentPage ok=${pageRes.ok} raw=${JSON.stringify(pageRes.data)}`);
  logger.debug(`getNumberOfPages ok=${totalPagesRes.ok} raw=${JSON.stringify(totalPagesRes.data)}`);

  if (!propsRes.ok) {
    logger.warn(`getProps failed: ${propsRes.error}`);
    await ev.setImage("imgs/actions/common/openBook.png");
    await ev.setTitle("");
    return;
  }

  const rawData = propsRes.data;
  const props: BookProps | undefined = Array.isArray(rawData)
    ? (rawData[0] as BookProps | undefined)
    : (rawData as BookProps | undefined);

  if (!props) {
    logger.warn("getProps returned empty data");
    await ev.setImage("imgs/actions/common/openBook.png");
    await ev.setTitle("");
    return;
  }

  const currentPage = pageRes.ok ? extractNumber(pageRes.data) : 0;
  const totalPages = totalPagesRes.ok ? extractNumber(totalPagesRes.data) : 0;

  logger.debug(`Book: "${props.title}" by ${props.authors} — page ${currentPage}/${totalPages}`);

  const { lines, fontSize } = resolveOverlay(settings.displayInfo, props, currentPage, totalPages);
  const coverDataUrl = await resolveCoverDataUrl(props, timeoutMs);

  logger.debug(`Cover resolved: ${coverDataUrl ? "yes" : "no"}, overlay lines: ${lines.length}`);

  await ev.setImage(buildBookImage(coverDataUrl, lines, fontSize));
  await ev.setTitle("");
}

@action({ UUID: "com.unai-gonzalez.koreadeck.get-book-info" })
export class GetBookInfo extends SingletonAction<GetBookInfoSettings> {
  override async onWillAppear(ev: WillAppearEvent<GetBookInfoSettings>): Promise<void> {
    try {
      await updateBookDisplay(ev.action, ev.payload.settings);
    } catch (err) {
      logger.error("onWillAppear failed:", err);
      await ev.action.setImage("imgs/actions/common/configErr.png");
      await ev.action.setTitle("");
    }
  }

  override async onDidReceiveSettings(ev: DidReceiveSettingsEvent<GetBookInfoSettings>): Promise<void> {
    try {
      await updateBookDisplay(ev.action, ev.payload.settings);
    } catch (err) {
      logger.error("onDidReceiveSettings failed:", err);
      await ev.action.setImage("imgs/actions/common/configErr.png");
      await ev.action.setTitle("");
    }
  }

  override async onKeyDown(ev: KeyDownEvent<GetBookInfoSettings>): Promise<void> {
    try {
      await updateBookDisplay(ev.action, ev.payload.settings);
      await ev.action.showOk();
    } catch (err) {
      logger.error("onKeyDown failed:", err);
      await ev.action.showAlert();
    }
  }
}
