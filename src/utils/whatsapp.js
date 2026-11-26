export function formatCOP(valor) {
  if (valor === null || valor === undefined || valor === "") {
    return "Consultar precio";
  }
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(Number(valor));
}

export function buildWhatsAppOrderUrl({
  numero = "573000000000",
  producto,
  variante,
}) {
  const colorNombre = variante?.color || "Original";
  const precioTexto = producto?.precioCOP
    ? ` (${formatCOP(producto.precioCOP)})`
    : "";

  const mensaje = `Hola ISAMAR, me encantó el modelo "${producto.nombre}" en color ${colorNombre}${precioTexto}. ¿Me confirmas disponibilidad y tiempos de elaboración?`;

  return `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
}

export function buildWhatsAppCartUrl({
  numero = "573000000000",
  items = [],
  totalCOP = 0,
}) {
  if (!items.length) {
    return buildWhatsAppGeneralUrl(numero);
  }

  const lineas = items.map((item, idx) => {
    const subtotal = item.precioCOP
      ? formatCOP(item.precioCOP * item.cantidad)
      : "Consultar precio";
    return `${idx + 1}. ${item.nombre} — Color: ${item.color} × ${item.cantidad} (${subtotal})`;
  });

  const mensaje = [
    "Hola ISAMAR, quiero realizar este pedido desde su catálogo:",
    "",
    ...lineas,
    "",
    `Total estimado: ${formatCOP(totalCOP)}`,
    "¿Me confirmas disponibilidad y tiempos de elaboración?",
  ].join("\n");

  return `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
}

export function buildWhatsAppGeneralUrl(
  numero = "573000000000",
  mensajePersonalizado = "Hola ISAMAR, me gustaría recibir asesoría sobre sus piezas tejidas a crochet."
) {
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensajePersonalizado)}`;
}
