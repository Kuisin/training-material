function parseEnvBool(value: string | undefined): boolean {
  if (!value) return false;
  return ["1", "true", "yes", "on"].includes(value.toLowerCase());
}

/** `.env` の `VITE_DEV_MODE=true` で有効。非公開コース・特別コンテンツのロックを解除する。 */
export const isDevMode = parseEnvBool(import.meta.env.VITE_DEV_MODE);
