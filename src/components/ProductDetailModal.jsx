import { resolveAssetUrl } from "../utils/assetUrl";
import { useEffect, useState } from "react";
import { formatCOP, buildWhatsAppOrderUrl } from "../utils/whatsapp";
import { CrochetBagIcon } from "./CrochetCartDrawer";
import "./ProductDetailModal.css";

export default function ProductDetailModal({
  producto,
  varianteInicial,
  whatsappNumero = "573000000000",
  onClose,
  onAddToCart,
}) {
  const variantes = producto?.variantesColor || [];
  const indiceInicial = Math.max(
    0,
    variantes.findIndex((v) => v.color === varianteInicial?.color)
  );
  const [indiceColor, setIndiceColor] = useState(indiceInicial);

  useEffect(() => {
    setIndiceColor(indiceInicial);
  }, [producto, indiceInicial]);

  useEffect(() => {
    if (!producto) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [producto, onClose]);

  if (!producto) return null;

  const varianteActiva = variantes[indiceColor] || {
    color: "Original",
    hex: "#460809",
    archivo: producto.fotoOriginal,
  };

  const waUrl = buildWhatsAppOrderUrl({
    numero: whatsappNumero,
    producto,
    variante: varianteActiva,
  });

  return (
    <div
      className="isamar-modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="isamar-modal-title"
    >
      <div className="isamar-modal" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="isamar-modal__close"
          onClick={onClose}
          aria-label="Cerrar detalle del producto"
        >
          ×
        </button>

        <div className="isamar-modal__grid">
          <div className="isamar-modal__media">
            <img
              src={resolveAssetUrl(varianteActiva.archivo)}
              alt={`${producto.nombre} en color ${varianteActiva.color}`}
              className="isamar-modal__img"
            />
          </div>

          <div className="isamar-modal__info">
            <span className="isamar-modal__categoria">{producto.categoria}</span>
            <h2 id="isamar-modal-title" className="isamar-modal__titulo">
              {producto.nombre}
            </h2>
            <p className="isamar-modal__precio">{formatCOP(producto.precioCOP)}</p>

            <p className="isamar-modal__estado">
              Estado:{" "}
              <strong>
                {producto.disponible ? "Disponible / Elaboración artesanal" : "Consultar disponibilidad"}
              </strong>
            </p>

            <p className="isamar-modal__descripcion">{producto.descripcion}</p>

            <div className="isamar-modal__swatches-wrap">
              <span className="isamar-modal__color-label">
                Color elegido: <strong>{varianteActiva.color}</strong>
              </span>
              <div className="isamar-modal__swatches">
                {variantes.map((v, idx) => (
                  <button
                    key={`${producto.id}-modal-${v.color}`}
                    type="button"
                    onClick={() => setIndiceColor(idx)}
                    className={`isamar-modal__swatch ${
                      idx === indiceColor ? "is-active" : ""
                    }`}
                    style={{ "--swatch-color": v.hex }}
                    title={v.color}
                    aria-label={`Elegir color ${v.color}`}
                  />
                ))}
              </div>
            </div>

            <dl className="isamar-modal__specs">
              <div>
                <dt>Medidas</dt>
                <dd>{producto.medidas}</dd>
              </div>
              <div>
                <dt>Materiales</dt>
                <dd>{producto.materiales}</dd>
              </div>
              <div>
                <dt>Cuidados</dt>
                <dd>{producto.cuidados}</dd>
              </div>
            </dl>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "14px" }}>
              {onAddToCart && (
                <button
                  type="button"
                  onClick={() => {
                    onAddToCart(producto, varianteActiva);
                    onClose();
                  }}
                  className="isamar-btn isamar-btn--primary isamar-modal__cta"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    cursor: "pointer",
                  }}
                >
                  <CrochetBagIcon size={18} />
                  <span>{varianteActiva.color}</span>
                </button>
              )}

              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="isamar-btn isamar-btn--outline isamar-modal__cta"
              >
                Confirmar pedido por WhatsApp ({varianteActiva.color})
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



