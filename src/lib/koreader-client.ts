import { DEFAULT_TIMEOUT } from "../config/koreader";
import { KoreaderRequest } from "../types/KoreaderRequest";
import { KoreaderResponse } from "../types/KoreaderResponse";
import { buildKoreaderUrl } from './koreader-url/koreader-url';

export const callKoreader = async <T = unknown>(
  request: KoreaderRequest,
  timeoutMs: number = DEFAULT_TIMEOUT,
): Promise<KoreaderResponse<T>> => {
  const url = buildKoreaderUrl(request.ip, request.path, request.port);
  if (!url) {
    return { ok: false, error: "missing-ip" };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      method: "GET",
      signal: controller.signal,
    });

    let data: T | undefined;
    try {
      const text = await response.text();
      if (text) {
        data = JSON.parse(text) as T;
      }
    } catch {
    }

    return { ok: response.ok, status: response.status, data };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "request-failed",
    };
  } finally {
    clearTimeout(timeout);
  }
};
