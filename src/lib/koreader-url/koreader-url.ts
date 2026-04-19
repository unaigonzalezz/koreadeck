import { KOREADER_PORT } from '../../config/koreader';
import { toNumber } from '../action-utils/action-utils';


const isHttpUrl = (value: string) => /^https?:\/\//i.test(value);

export const normalizeBaseUrl = (ip?: string, port?: number | string): string | null => {
  const trimmed = ip?.trim();
  if (!trimmed) return null;
  const resolvedPort = toNumber(port, KOREADER_PORT);

  if (isHttpUrl(trimmed)) {
    try {
      const url = new URL(trimmed);
      url.port = `${resolvedPort}`;
      return url.origin;
    } catch {
      return null;
    }
  }

  const withoutPort = trimmed.replace(/:\d+$/, "");
  return `http://${withoutPort}:${resolvedPort}`;
};

export const buildKoreaderUrl = (ip: string | undefined, path: string, port?: number | string): string | null => {
  const base = normalizeBaseUrl(ip, port);
  if (!base) return null;
  return `${base}${path.startsWith("/") ? "" : "/"}${path}`;
};
