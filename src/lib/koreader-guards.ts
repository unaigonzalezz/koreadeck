import { callKoreader } from "./koreader-client";

export const ensureBookOpen = async (ip: string, port: number, timeoutMs: number): Promise<boolean> => {
  const res = await callKoreader({ ip, port, path: "/koreader/ui/getCurrentPage/" }, timeoutMs);
  return res.ok;
};
