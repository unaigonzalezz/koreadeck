import streamDeck from "@elgato/streamdeck";
import { readFile } from "node:fs/promises";
import http, { IncomingMessage, ServerResponse } from "node:http";
import path from "node:path";
import { CONFIG_PAGE_PATH, DEFAULT_TIMEOUT, KOREADER_PORT, SUCCESS_PAGE_PATH } from "../config/koreader";
import { KoreaderGlobalSettings } from "../types/KoreaderGlobalSettings";
import { toNumber } from './action-utils/action-utils';

let server: http.Server | null = null;
let serverUrl: string | null = null;
let htmlCache: string | null = null;
let starting: Promise<string> | null = null;
let successHtmlCache: string | null = null;

const readBody = async (req: IncomingMessage): Promise<string> =>
  new Promise((resolve, reject) => {
    const chunks: Uint8Array[] = [];
    req.on("data", (chunk: Uint8Array) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
    req.on("error", reject);
  });

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

const sendAsset = (res: ServerResponse, contentType: string, body: Buffer): void => {
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
    default:
      return "application/octet-stream";
  }
};

const loadHtml = async (): Promise<string> => {
  if (htmlCache) {
    return htmlCache;
  }
  htmlCache = await readFile(CONFIG_PAGE_PATH, "utf-8");
  return htmlCache;
};

const handleSettingsPost = async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
  const body = await readBody(req);
  let parsed: Partial<KoreaderGlobalSettings> = {};
  try {
    parsed = JSON.parse(body) as Partial<KoreaderGlobalSettings>;
  } catch {
    sendJson(res, 400, { ok: false, error: "invalid-json" });
    return;
  }

  const ip = typeof parsed.ip === "string" ? parsed.ip.trim() : "";
  
  if (!ip) {
    sendJson(res, 400, { ok: false, error: "missing-ip" });
    return;
  }

  const port = toNumber(parsed.port, KOREADER_PORT);
  const timeoutMs = toNumber(parsed.timeoutMs, DEFAULT_TIMEOUT);

  const payload: KoreaderGlobalSettings = {
    ip,
    port,
    timeoutMs,
  };

  await streamDeck.settings.setGlobalSettings(payload);
  sendJson(res, 200, { ok: true });
};

const loadSuccessHtml = async (): Promise<string> => {
  if (successHtmlCache) {
    return successHtmlCache;
  }
  successHtmlCache = await readFile(SUCCESS_PAGE_PATH, "utf-8");
  return successHtmlCache;
};

const requestHandler = async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
  try {
    const url = new URL(req.url ?? "/", "http://localhost");
    const configDir = path.resolve(path.dirname(CONFIG_PAGE_PATH));
    if (req.method === "GET" && (url.pathname === "/" || url.pathname === "/config")) {
      const html = await loadHtml();
      sendHtml(res, html);
      return;
    }

    if (req.method === "GET" && url.pathname === "/config/success") {
      const html = await loadSuccessHtml();
      sendHtml(res, html);
      return;
    }

    if (
      req.method === "GET" &&
      (url.pathname.startsWith("/const/") || url.pathname.startsWith("/img/") || url.pathname.startsWith("/styles/") || url.pathname.startsWith("/fonts/"))
    ) {
      const requestPath = url.pathname.replace(/^\/+/, "");
      const assetPath = path.resolve(configDir, requestPath);
      const relativePath = path.relative(configDir, assetPath);
      if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
        sendJson(res, 404, { ok: false, error: "not-found" });
        return;
      }

      try {
        const body = await readFile(assetPath);
        sendAsset(res, getContentType(assetPath), body);
      } catch {
        sendJson(res, 404, { ok: false, error: "not-found" });
      }
      return;
    }

    if (req.method === "GET" && url.pathname === "/settings") {
      const globalSettings = await streamDeck.settings.getGlobalSettings<KoreaderGlobalSettings>();
      sendJson(res, 200, {
        ok: true,
        settings: {
          ip: globalSettings.ip ?? "",
          port: toNumber(globalSettings.port, KOREADER_PORT),
          timeoutMs: toNumber(globalSettings.timeoutMs, DEFAULT_TIMEOUT),
        },
      });
      return;
    }

    if (req.method === "POST" && url.pathname === "/settings") {
      await handleSettingsPost(req, res);
      return;
    }

    sendJson(res, 404, { ok: false, error: "not-found" });
  } catch (error) {
    sendJson(res, 500, { ok: false, error: error instanceof Error ? error.message : "server-error" });
  }
};

export const ensureConfigServer = async (): Promise<string> => {
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
        serverUrl = `http://localhost:${address.port}/config`;
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
