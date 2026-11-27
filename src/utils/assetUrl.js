export function resolveAssetUrl(ruta) {
  if (!ruta || typeof ruta !== "string") return "";
  if (/^(https?:|data:|blob:)/i.test(ruta)) return ruta;

  const base = import.meta.env.BASE_URL || "/";
  const baseNormalizada = base.endsWith("/") ? base : `${base}/`;
  const rutaLimpia = ruta.replace(/^\/+/, "");

  if (rutaLimpia.startsWith(baseNormalizada.replace(/^\/+/, ""))) {
    return `/${rutaLimpia}`;
  }

  return `${baseNormalizada}${rutaLimpia}`;
}
