import { SCREEN_PREVIEW_IGNORED_UUIDS } from "../config/koreader";

type ScreenPreviewSettings = {
  watchUuids?: string;
};

const watchers = new Map<string, Set<string>>();
const aggregated = new Set<string>();
let refreshToken = 0;

const normalizeUuids = (raw?: string): Set<string> => {
  if (!raw) return new Set();
  return new Set(
    raw
      .split(/\s*,\s*|\s*\n\s*|\s*;\s*/g)
      .map((value) => value.trim())
      .filter(Boolean),
  );
};

const rebuildAggregate = (): void => {
  aggregated.clear(); 
  for (const uuids of watchers.values()) {
    for (const uuid of uuids) {
      aggregated.add(uuid);
    }
  }
};

export const registerScreenWatcher = (context: string, settings: ScreenPreviewSettings): void => {
  const uuids = normalizeUuids(settings.watchUuids);
  watchers.set(context, uuids);
  rebuildAggregate();
};

export const unregisterScreenWatcher = (context: string): void => {
  if (watchers.delete(context)) {
    rebuildAggregate();
  }
};

export const shouldRefreshForAction = (actionUuid: string): boolean => {
  if (SCREEN_PREVIEW_IGNORED_UUIDS.includes(actionUuid)) {
    return false;
  }

  if (aggregated.size === 0) {
    return true;
  }

  return aggregated.has(actionUuid);
};

export const bumpScreenRefreshToken = (): number => {
  refreshToken += 1;
  return refreshToken;
};

export const getScreenRefreshToken = (): number => refreshToken;
