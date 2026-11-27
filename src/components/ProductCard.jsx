import { resolveAssetUrl } from "../utils/assetUrl";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { formatCOP, buildWhatsAppOrderUrl } from "../utils/whatsapp";
import { CrochetBagIcon } from "./CrochetCartDrawer";
import { CategoryBadgeIcon } from "./CategoryIcons";
import "./ProductCard.css";

export default function ProductCard({
  producto,
  whatsappNumero = "573000000000",
  onSelectProduct,
  onAddToCart,
}) {
  const variantes = producto?.variantesColor || [];
  const [indiceColor, setIndiceColor] = useState(-1);
  const [hoverActivo, setHoverActivo] = useState(false);
  const [agregado, setAgregado] = useState(false);

  const cardRef = useRef(null);
  const imgRef = useRef(null);
  const etiquetaColorRef = useRef(null);

  const varianteActiva = variantes[indiceColor] || {
    color: "Original",
    hex: "#460809",
    archivo: producto.fotoOriginal,
    esFotoReal: false,
  };

  const fotoAlternativaVariante0 =
    variantes[0]?.fotoSecundaria ||
    variantes[0]?.fotoUso ||
    variantes[0]?.fotoAngulo ||
    (variantes[0]?.archivo && variantes[0].archivo !== varianteActiva.archivo
      ? variantes[0].archivo
      : null);

  const fotoGaleriaAlternativa = Array.isArray(producto?.galeria)
    ? producto.galeria.find((ruta) => ruta && ruta !== varianteActiva.archivo) || null
    : null;

  const fotoSecundaria =
    varianteActiva.fotoSecundaria ||
    varianteActiva.fotoUso ||
    varianteActiva.fotoAngulo ||
    producto.fotoSecundaria ||
    producto.fotoUso ||
    (indiceColor === -1 ? fotoAlternativaVariante0 || fotoGaleriaAlternativa : null) ||
    null;

  const imagenMostrada =
    hoverActivo && fotoSecundaria ? fotoSecundaria : varianteActiva.archivo;

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(cardRef.current, {
        y: 18,
        opacity: 0,
        duration: 0.5,
        ease: "power2.out",
        clearProps: "transform",
      });
    }, cardRef);

    return () => ctx.revert();
  }, []);

  const animarCambioFoto = (esHover) => {
    if (!imgRef.current) return;

    if (fotoSecundaria) {
      gsap.fromTo(
        imgRef.current,
        { opacity: 0.45, scale: esHover ? 1.03 : 1.02 },
        {
          opacity: 1,
          scale: esHover ? 1.04 : 1,
          duration: 0.35,
          ease: "power2.out",
          clearProps: "transform",
        }
      );
    } else {
      gsap.to(imgRef.current, {
        scale: esHover ? 1.04 : 1,
        duration: 0.3,
        ease: "power2.out",
        clearProps: "transform",
      });
    }
  };

  const handleMouseEnter = () => {
    setHoverActivo(true);
    animarCambioFoto(true);
  };

  const handleMouseLeave = () => {
    setHoverActivo(false);
    animarCambioFoto(false);
  };

  const handleSelectColor = (nuevoIndice) => {
    if (nuevoIndice === indiceColor) return;
    setIndiceColor(nuevoIndice);
    setHoverActivo(false);

    if (imgRef.current) {
      gsap.fromTo(
        imgRef.current,
        { opacity: 0.35, scale: 1.03 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.38,
          ease: "power2.out",
          clearProps: "transform",
        }
      );
    }

    if (etiquetaColorRef.current) {
      gsap.fromTo(
        etiquetaColorRef.current,
        { y: -4, opacity: 0.5 },
        {
          y: 0,
          opacity: 1,
          duration: 0.25,
          ease: "power1.out",
          clearProps: "transform",
        }
      );
    }
  };

  const handleAdd = () => {
    if (onAddToCart) {
      onAddToCart(producto, varianteActiva);
    }
    setAgregado(true);
    window.setTimeout(() => setAgregado(false), 1100);
  };

  const waUrl = buildWhatsAppOrderUrl({
    numero: whatsappNumero,
    producto,
    variante: varianteActiva,
  });

  return (
    <article ref={cardRef} className="isamar-card">
      <div
        className="isamar-card__media"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => onSelectProduct && onSelectProduct(producto, varianteActiva)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onSelectProduct && onSelectProduct(producto, varianteActiva);
          }
        }}
        aria-label={`Ver detalles de ${producto.nombre}`}
      >
        <img
          ref={imgRef}
          src={resolveAssetUrl(imagenMostrada)}
          alt={
            hoverActivo && fotoSecundaria
              ? `${producto.nombre} en color ${varianteActiva.color} - vista alternativa`
              : `${producto.nombre} en color ${varianteActiva.color}`
          }
          className="isamar-card__img"
          loading="lazy"
        />

        <span className="isamar-card__badge">
          {producto.disponible ? "Disponible" : "Por encargo"}
        </span>
      </div>

      <div className="isamar-card__body">
        <div className="isamar-card__top">
          <span className="isamar-card__categoria" style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}><CategoryBadgeIcon categoria={producto.categoria} size={13} /><span>{producto.categoria}</span></span>
          <button
            type="button"
            onClick={() => onSelectProduct && onSelectProduct(producto, varianteActiva)}
            className="isamar-card__detail-link"
          >
            Ver detalle
          </button>
        </div>

        <h3 className="isamar-card__titulo">{producto.nombre}</h3>
        <strong className="isamar-card__precio">{formatCOP(producto.precioCOP)}</strong>

        <div className="isamar-card__swatches-block">
          <div className="isamar-card__color-label">
            <span>Color:</span>
            <strong ref={etiquetaColorRef}>{varianteActiva.color}</strong>
          </div>

          <div
            className="isamar-card__swatches"
            role="radiogroup"
            aria-label={`Colores disponibles para ${producto.nombre}`}
          >
            {variantes.map((v, idx) => {
              const activa = idx === indiceColor;
              return (
                <button
                  key={`${producto.id}-${v.color}`}
                  type="button"
                  onClick={() => handleSelectColor(idx)}
                  className={`isamar-swatch ${activa ? "is-active" : ""}`}
                  style={{ "--swatch-color": v.hex }}
                  title={v.color}
                  aria-label={`Seleccionar color ${v.color}`}
                  aria-checked={activa}
                  role="radio"
                >
                  <span className="isamar-swatch__dot" />
                </button>
              );
            })}
          </div>
        </div>

        <div className="isamar-card__actions" style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <button
            type="button"
            onClick={handleAdd}
            className="isamar-btn isamar-btn--primary"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              width: "100%",
              cursor: "pointer",
            }}
          >
            <CrochetBagIcon size={17} />
            <span>{agregado ? "¡Listo!" : ""}</span>
          </button>

          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="isamar-btn isamar-btn--outline"
          >
            Consultar por WhatsApp
          </a>
        </div>
      </div>
    </article>
  );
}





