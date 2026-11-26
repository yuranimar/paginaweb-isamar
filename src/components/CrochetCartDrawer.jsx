import { useEffect } from "react";
import { formatCOP, buildWhatsAppCartUrl } from "../utils/whatsapp";
import "./CrochetCartDrawer.css";

export function CrochetBagIcon({ size = 20, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      {/* Asa curva del bolsito tejido */}
      <path
        d="M8 8V6.5C8 4.01 9.79 2 12 2C14.21 2 16 4.01 16 6.5V8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Cuerpo redondeado del bolsito */}
      <path
        d="M4.5 9.5C4.5 8.67 5.17 8 6 8H18C18.83 8 19.5 8.67 19.5 9.5L20.4 18.5C20.5 19.88 19.41 21 18.02 21H5.98C4.59 21 3.5 19.88 3.6 18.5L4.5 9.5Z"
        fill="currentColor"
        fillOpacity="0.14"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinejoin="round"
      />
      {/* Puntadas de crochet */}
      <path
        d="M7.5 11.5H9.5M11 11.5H13M14.5 11.5H16.5M6.8 14.5H8.8M10.5 14.5H13.5M15.2 14.5H17.2M7.5 17.5H9.5M11 17.5H13M14.5 17.5H16.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeDasharray="1.5 1.8"
      />
    </svg>
  );
}

export default function CrochetCartDrawer({
  abierto,
  onClose,
  items = [],
  whatsappNumero = "573000000000",
  onIncrementar,
  onDecrementar,
  onEliminar,
  onVaciar,
}) {
  useEffect(() => {
    if (!abierto) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [abierto, onClose]);

  if (!abierto) return null;

  const totalCantidad = items.reduce((acc, item) => acc + item.cantidad, 0);
  const totalCOP = items.reduce(
    (acc, item) => acc + (Number(item.precioCOP) || 0) * item.cantidad,
    0
  );

  const waCartUrl = buildWhatsAppCartUrl({
    numero: whatsappNumero,
    items,
    totalCOP,
  });

  return (
    <div
      className="isamar-cart-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Carrito de compras ISAMAR"
    >
      <aside className="isamar-cart-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="isamar-cart-header">
          <div className="isamar-cart-title-wrap">
            <span className="isamar-cart-bag-badge">
              <CrochetBagIcon size={22} />
            </span>
            <div>
              <h2 className="isamar-cart-title">Tu Pedido</h2>
              <span className="isamar-cart-subtitle">
                {totalCantidad} {totalCantidad === 1 ? "pieza seleccionada" : "piezas seleccionadas"}
              </span>
            </div>
          </div>

          <button
            type="button"
            className="isamar-cart-close"
            onClick={onClose}
            aria-label="Cerrar carrito"
          >
            ×
          </button>
        </div>

        <div className="isamar-cart-body">
          {items.length === 0 ? (
            <div className="isamar-cart-empty">
              <CrochetBagIcon size={40} />
              <p>Tu carrito está vacío todavía.</p>
              <span>Elige un bolso o cosmetiquera y añádelo aquí para armar tu pedido.</span>
            </div>
          ) : (
            <ul className="isamar-cart-list">
              {items.map((item) => (
                <li key={item.clave} className="isamar-cart-item">
                  <img
                    src={item.foto}
                    alt={`${item.nombre} en color ${item.color}`}
                    className="isamar-cart-item__img"
                  />
                  <div className="isamar-cart-item__info">
                    <h3 className="isamar-cart-item__name">{item.nombre}</h3>
                    <span className="isamar-cart-item__color">
                      <span
                        className="isamar-cart-item__dot"
                        style={{ backgroundColor: item.hex || "#460809" }}
                      />
                      {item.color}
                    </span>
                    <strong className="isamar-cart-item__price">
                      {formatCOP((Number(item.precioCOP) || 0) * item.cantidad)}
                    </strong>

                    <div className="isamar-cart-item__controls">
                      <div className="isamar-qty-box">
                        <button
                          type="button"
                          onClick={() => onDecrementar(item.clave)}
                          aria-label={`Disminuir cantidad de ${item.nombre}`}
                        >
                          −
                        </button>
                        <span>{item.cantidad}</span>
                        <button
                          type="button"
                          onClick={() => onIncrementar(item.clave)}
                          aria-label={`Aumentar cantidad de ${item.nombre}`}
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => onEliminar(item.clave)}
                        className="isamar-cart-remove"
                      >
                        Quitar
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="isamar-cart-footer">
            <div className="isamar-cart-total-row">
              <span>Total estimado</span>
              <strong>{formatCOP(totalCOP)}</strong>
            </div>

            <a
              href={waCartUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="isamar-btn isamar-btn--primary isamar-cart-wa-btn"
            >
              Enviar pedido por WhatsApp
            </a>

            <button
              type="button"
              onClick={onVaciar}
              className="isamar-cart-clear-btn"
            >
              Vaciar carrito
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}

