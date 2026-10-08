import type { Context } from "hono"
import type { ContentfulStatusCode } from "hono/utils/http-status"

export type ApiSuccess<T> = { data: T; message?: string }
export type ApiError = { message: string; code?: string; details?: unknown }

export function ok<T>(c: Context, data: T, status: ContentfulStatusCode = 200) {
  return c.json<ApiSuccess<T>>({ data }, status)
}

export function err(c: Context, message: string, status: ContentfulStatusCode = 400) {
  return c.json<ApiError>({ message }, status)
}

export enum Role {
  Owner,
  Viewer,
}
