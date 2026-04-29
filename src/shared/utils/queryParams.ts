import type { Request } from "express";

/** Express may supply query values as string | string[] — normalize to one string. */
export function queryString(req: Request, key: string): string | undefined {
  const v = req.query[key];
  if (typeof v === "string") return v;
  if (Array.isArray(v) && typeof v[0] === "string") return v[0];
  return undefined;
}

/** Same normalization for `req.params` when typings allow string[]. */
export function routeParam(req: Request, key: string): string | undefined {
  const v = req.params[key];
  if (typeof v === "string") return v;
  if (Array.isArray(v) && typeof v[0] === "string") return v[0];
  return undefined;
}
