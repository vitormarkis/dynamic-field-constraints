export type Only<T extends any> = T extends
  | Record<string, unknown>
  | readonly any[]
  ? Mutable<T>
  : T

export type Mutable<T> = T extends Record<string, unknown> | readonly any[]
  ? { -readonly [K in keyof T]: Mutable<T[K]> } & unknown
  : T

export function bad<const T>(error: T) {
  return [error, undefined] as [T, undefined]
}

export function nice<const T = undefined>(result?: T) {
  return [undefined, result] as [undefined, T]
}

export function only<const T = any>(result: T) {
  return result as Only<T>
}
