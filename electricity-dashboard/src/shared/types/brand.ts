declare const __brand: unique symbol;

export type Brand<T, B extends string> = T & { readonly [__brand]: B };

export type OutageId = Brand<string, "OutageId">;
export type RegionId = Brand<string, "RegionId">;
export type AlertId = Brand<string, "AlertId">;
export type UserId = Brand<string, "UserId">;
