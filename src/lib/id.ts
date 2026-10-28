import { toBase64Url } from "@/lib/encoding";

// Short URL-safe id, 12 chars from 9 random bytes. Plenty for public form ids.
export function newId(): string {
  return toBase64Url(crypto.getRandomValues(new Uint8Array(9)));
}
