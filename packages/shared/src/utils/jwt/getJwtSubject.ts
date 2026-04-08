const normalizeBase64Url = (value: string): string => {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const paddingLength = (4 - (base64.length % 4)) % 4;
  return base64 + "=".repeat(paddingLength);
};

export const getJwtSubject = (token: string | null | undefined): string | null => {
  if (!token) return null;

  const [, payload] = token.split(".");
  if (!payload) return null;

  try {
    const normalized = normalizeBase64Url(payload);
    const parsed = JSON.parse(atob(normalized)) as { sub?: unknown };
    return typeof parsed.sub === "string" ? parsed.sub : null;
  } catch {
    return null;
  }
};
