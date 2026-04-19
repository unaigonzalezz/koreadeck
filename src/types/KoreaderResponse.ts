export type KoreaderResponse<T = unknown> = {
  ok: boolean;
  status?: number;
  error?: string;
  data?: T;
};
