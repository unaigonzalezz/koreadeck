import streamDeck from "@elgato/streamdeck";
import { readFile } from "node:fs/promises";
import http, { IncomingMessage, ServerResponse } from "node:http";
import path from "node:path";
import { DEFAULT_TIMEOUT, KOREADER_PORT, SCREEN_PAGE_PATH } from "../config/koreader";
import { KoreaderGlobalSettings } from "../types/KoreaderGlobalSettings";
import { getScreenRefreshToken } from "./screen-refresh";
import { toNumber } from './action-utils/action-utils';
import { buildKoreaderUrl } from './koreader-url/koreader-url';

let server: http.Server | null = null;
let serverUrl: string | null = null;
let htmlCache: string | null = null;
let starting: Promise<string> | null = null;

const sendJson = (res: ServerResponse, status: number, payload: unknown): void => {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  res.end(JSON.stringify(payload));
};

const sendHtml = (res: ServerResponse, html: string): void => {
  res.writeHead(200, {
    "Content-Type": "text/html; charset=utf-8",
    "Cache-Control": "no-store",
  });
  res.end(html);
};

const sendImage = (res: ServerResponse, contentType: string, body: Buffer): void => {
  res.writeHead(200, {
    "Content-Type": contentType,
    "Cache-Control": "no-store",
  });
  res.end(body);
};

const getContentType = (filePath: string): string => {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case ".js":
      return "application/javascript; charset=utf-8";
    case ".css":
      return "text/css; charset=utf-8";
    case ".png":
      return "image/png";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".svg":
      return "image/svg+xml";
    case ".ico":
      return "image/x-icon";
    case ".ttf":
      return "font/ttf";
    case ".woff":
      return "font/woff";
    case ".woff2":
      return "font/woff2";
    default:
      return "application/octet-stream";
  }
};

const loadHtml = async (): Promise<string> => {
  if (htmlCache) {
    return htmlCache;
  }
  htmlCache = await readFile(SCREEN_PAGE_PATH, "utf-8");
  return htmlCache;
};

const fetchJsonFromKoreader = async (ip: string, port: number, kPath: string, timeoutMs: number): Promise<unknown> => {
  const url = buildKoreaderUrl(ip, kPath, port);
  if (!url) return null;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { method: "GET", signal: controller.signal });
    if (!response.ok) return null;
    const text = await response.text();
    return text ? (JSON.parse(text) as unknown) : null;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
};

const requestScreenImage = async (
  ip: string,
  port: number,
  timeoutMs: number,
): Promise<{ body: Buffer; contentType: string } | null> => {
  const url = buildKoreaderUrl(ip, "/koreader/device/screen/bb", port);
  if (!url) return null;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, { method: "GET", signal: controller.signal });
    if (!response.ok) return null;

    const arrayBuffer = await response.arrayBuffer();
    const contentType = response.headers.get("content-type") || "image/png";
    return { body: Buffer.from(arrayBuffer), contentType };
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
};

const requestHandler = async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
  try {
    const url = new URL(req.url ?? "/", "http://localhost");
    if (req.method === "GET" && (url.pathname === "/" || url.pathname === "/screen")) {
      const html = await loadHtml();
      sendHtml(res, html);
      return;
    }

    if (req.method === "GET" && url.pathname === "/screen/state") {
      sendJson(res, 200, { ok: true, token: getScreenRefreshToken() });
      return;
    }

    if (
      req.method === "GET" &&
      (url.pathname.startsWith("/img/") || url.pathname.startsWith("/styles/") || url.pathname.startsWith("/fonts/") || url.pathname.startsWith("/js/"))
    ) {
      const uiDir = path.resolve(path.dirname(SCREEN_PAGE_PATH), "..");
      const assetPath = path.resolve(uiDir, url.pathname.replace(/^\/+/, ""));
      const relativePath = path.relative(uiDir, assetPath);
      if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
        sendJson(res, 404, { ok: false, error: "not-found" });
        return;
      }
      try {
        const body = await readFile(assetPath);
        sendImage(res, getContentType(assetPath), body);
      } catch {
        sendJson(res, 404, { ok: false, error: "not-found" });
      }
      return;
    }

    if (req.method === "GET" && url.pathname === "/screen/info") {
      const globalSettings = await streamDeck.settings.getGlobalSettings<KoreaderGlobalSettings>();
      const ip = globalSettings.ip?.trim();
      const port = toNumber(globalSettings.port, KOREADER_PORT);
      const timeoutMs = toNumber(globalSettings.timeoutMs, DEFAULT_TIMEOUT);

      if (!ip) {
        sendJson(res, 200, { ok: true, connected: false });
        return;
      }

      const [propsRaw, pageRaw, totalRaw] = await Promise.all([
        fetchJsonFromKoreader(ip, port, "/koreader/ui/document/getProps/", timeoutMs),
        fetchJsonFromKoreader(ip, port, "/koreader/ui/getCurrentPage/", timeoutMs),
        fetchJsonFromKoreader(ip, port, "/koreader/ui/getTotalPages/", timeoutMs),
      ]);

      const props = Array.isArray(propsRaw)
        ? ((propsRaw[0] as Record<string, unknown> | undefined) ?? null)
        : propsRaw != null && typeof propsRaw === "object"
          ? (propsRaw as Record<string, unknown>)
          : null;

      const toPage = (raw: unknown): number | null => {
        if (typeof raw === "number") return raw;
        if (Array.isArray(raw) && typeof raw[0] === "number") return raw[0];
        return null;
      };

      const page = toPage(pageRaw);
      const total = toPage(totalRaw);

      sendJson(res, 200, {
        ok: true,
        connected: props !== null || page !== null,
        title: typeof props?.title === "string" ? props.title : null,
        authors: typeof props?.authors === "string" ? props.authors : null,
        page,
        total,
      });
      return;
    }

    if (req.method === "GET" && url.pathname === "/screen/image") {
      const globalSettings = await streamDeck.settings.getGlobalSettings<KoreaderGlobalSettings>();
      const ip = globalSettings.ip?.trim();
      const port = toNumber(globalSettings.port, KOREADER_PORT);
      const timeoutMs = toNumber(globalSettings.timeoutMs, DEFAULT_TIMEOUT);

      if (!ip) {
        sendJson(res, 400, { ok: false, error: "missing-ip" });
        return;
      }

      const image = await requestScreenImage(ip, port, timeoutMs);
      if (!image) {
        sendJson(res, 502, { ok: false, error: "image-fetch-failed" });
        return;
      }

      sendImage(res, image.contentType, image.body);
      return;
    }

    sendJson(res, 404, { ok: false, error: "not-found" });
  } catch (error) {
    sendJson(res, 500, { ok: false, error: error instanceof Error ? error.message : "server-error" });
  }
};

export const ensureScreenServer = async (): Promise<string> => {
  if (serverUrl) {
    return serverUrl;
  }
  if (starting) {
    return starting;
  }

  starting = new Promise((resolve, reject) => {
    try {
      server = http.createServer(requestHandler);
      server.listen(0, "localhost", () => {
        const address = server?.address();
        if (!address || typeof address === "string") {
          reject(new Error("server-address-not-available"));
          return;
        }
        serverUrl = `http://localhost:${address.port}/screen`;
        resolve(serverUrl);
      });

      server.on("error", (err) => {
        reject(err);
      });
    } catch (err) {
      reject(err);
    }
  });

  return starting;
};
