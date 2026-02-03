/* ---------- utils ---------- */
function buildUrl(path: string, params?: Record<string, any>) {
  if (!params) return path;

  const query = new URLSearchParams(
    Object.entries(params)
      .filter(([_, v]) => v !== undefined && v !== "")
      .map(([k, v]) => [k, Array.isArray(v) ? v.join(",") : String(v)]),
  ).toString();

  return `${path}?${query}`;
}

export { buildUrl };
