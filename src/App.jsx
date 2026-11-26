import { useEffect, useRef, useState } from "react";
import catalogoData from "./data/catalogoInicial.json";
import ProductCard from "./components/ProductCard";
import ProductDetailModal from "./components/ProductDetailModal";
import CrochetCartDrawer, { CrochetBagIcon } from "./components/CrochetCartDrawer";
import "./sections/Header.css";
import "./sections/HeroLookbook.css";

const STORAGE_KEY = "isamar_bolsito_v1";

export default function App() {
  const [seleccion, setSeleccion] = useState(null);
  const [categoriaActiva, setCategoriaActiva] = useState("Todos");
  const [busqueda, setBusqueda] = useState("");
  const [busquedaAbierta, setBusquedaAbierta] = useState(false);
  const [carritoAbierto, setCarritoAbierto] = useState(false);
  const [carrito, setCarrito] = useState(() => {
    try {
      const guardado = localStorage.getItem(STORAGE_KEY);
      return guardado ? JSON.parse(guardado) : [];
    } catch {
      return [];
    }
  });

  const inputBusquedaRef = useRef(null);

  const categorias = ["Todos", "Bolsos", "Cosmetiqueras"];

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(carrito));
    } catch {
      // Ignorar errores de almacenamiento
    }
  }, [carrito]);

  useEffect(() => {
    if (busquedaAbierta && inputBusquedaRef.current) {
      inputBusquedaRef.current.focus();
    }
  }, [busquedaAbierta]);

  const handleAgregarAlCarrito = (producto, variante) => {
    const colorNombre = variante?.color || "Original";
    const clave = `${producto.id}__${colorNombre}`;
    const foto = variante?.archivo || producto.fotoOriginal;

    setCarrito((prev) => {
      const existente = prev.find((item) => item.clave === clave);
      if (existente) {
        return prev.map((item) =>
          item.clave === clave ? { ...item, cantidad: item.cantidad + 1 } : item
        );
      }
      return [
        ...prev,
        {
          clave,
          id: producto.id,
          nombre: producto.nombre,
          precioCOP: Number(producto.precioCOP) || 0,
          color: colorNombre,
          hex: variante?.hex || "#460809",
          foto,
          cantidad: 1,
        },
      ];
    });
  };

  const handleIncrementar = (clave) => {
    setCarrito((prev) =>
      prev.map((item) =>
        item.clave === clave ? { ...item, cantidad: item.cantidad + 1 } : item
      )
    );
  };

  const handleDecrementar = (clave) => {
    setCarrito((prev) =>
      prev
        .map((item) =>
          item.clave === clave ? { ...item, cantidad: item.cantidad - 1 } : item
        )
        .filter((item) => item.cantidad > 0)
    );
  };

  const handleEliminar = (clave) => {
    setCarrito((prev) => prev.filter((item) => item.clave !== clave));
  };

  const handleVaciar = () => {
    setCarrito([]);
  };

  const totalPiezas = carrito.reduce((acc, item) => acc + item.cantidad, 0);

  const termino = busqueda.trim().toLowerCase();

  const productosFiltrados = catalogoData.productos.filter((p) => {
    const coincideCategoria =
      categoriaActiva === "Todos"
        ? true
        : categoriaActiva === "Cosmetiqueras"
        ? p.categoria?.toLowerCase().includes("cosmetiquera") ||
          p.nombre?.toLowerCase().includes("cosmetiquera") ||
          p.categoria === "Accesorios adicionales"
        : p.categoria === "Bolsos";

    if (!coincideCategoria) return false;
    if (!termino) return true;

    const coincideNombre = p.nombre?.toLowerCase().includes(termino);
    const coincideCategoriaTexto = p.categoria?.toLowerCase().includes(termino);
    const coincideColor = (p.variantesColor || []).some((v) =>
      v.color?.toLowerCase().includes(termino)
    );

    return coincideNombre || coincideCategoriaTexto || coincideColor;
  });

  const handleSubmitBusqueda = (e) => {
    e.preventDefault();
    const catalogoEl = document.getElementById("catalogo");
    if (catalogoEl) {
      catalogoEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const fotoHero = "/assets/galeria/06-cosmetiquera/hero.jpeg";
  const fotoRespaldo = "/assets/galeria/06-cosmetiquera/bolso_tejido_elegancia_portada.jpeg";
  const fotoDetalle = "/assets/galeria/06-cosmetiquera/bolso_tejido_elegancia_hover.jpeg";

  return (
    <div id="inicio" style={{ backgroundColor: "#FFFFFF", color: "#000000" }}>
      <header className="isamar-header">
        <nav className="isamar-nav" aria-label="Navegación principal">
          <a href="#inicio" className="isamar-brand">
            <img
              src="/assets/galeria/01_Logos/logo_isamar_principal.jpeg"
              alt={catalogoData.marca}
              className="isamar-brand__logo"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
            <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.05 }}>
              <span className="isamar-brand__title">ISAMAR</span>
              <span
                style={{
                  fontSize: "0.62rem",
                  letterSpacing: "0.14em",
                  color: "#5E3125",
                  fontWeight: 600,
                }}
              >
                ARTESANÍA CON IDENTIDAD
              </span>
            </span>
          </a>

          <ul className="isamar-nav__links">
            <li>
              <a href="#inicio">Inicio</a>
            </li>
            <li>
              <a href="#catalogo">Tienda</a>
            </li>
            <li>
              <a href="#detalles">Nosotros</a>
            </li>
            <li>
              <a href="#footer-isamar">Contacto</a>
            </li>
          </ul>

          <div className="isamar-nav__actions">
            <div className="isamar-nav__search">
              {busquedaAbierta && (
                <form
                  onSubmit={handleSubmitBusqueda}
                  className="isamar-search-form"
                  role="search"
                  aria-label="Buscar productos en el catálogo"
                >
                  <input
                    ref={inputBusquedaRef}
                    type="search"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    placeholder="Buscar bolso, color..."
                    className="isamar-search-input"
                    aria-label="Buscar producto o color"
                  />
                  {busqueda && (
                    <button
                      type="button"
                      onClick={() => setBusqueda("")}
                      className="isamar-search-clear"
                      aria-label="Limpiar búsqueda"
                      title="Limpiar"
                    >
                      ×
                    </button>
                  )}
                </form>
              )}

              <button
                type="button"
                onClick={() => {
                  if (busquedaAbierta && termino) {
                    const catalogoEl = document.getElementById("catalogo");
                    if (catalogoEl) {
                      catalogoEl.scrollIntoView({ behavior: "smooth", block: "start" });
                    }
                  } else {
                    setBusquedaAbierta((prev) => !prev);
                  }
                }}
                className={`isamar-search-btn ${busquedaAbierta ? "is-open" : ""}`}
                aria-expanded={busquedaAbierta}
                aria-label="Buscar en el catálogo"
                title="Buscar"
              >
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="11" cy="11" r="7" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <span>Buscar</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setCarritoAbierto(true)}
              className="isamar-crochet-bag-btn"
              aria-label={`Abrir carrito con ${totalPiezas} piezas`}
              title="Carrito"
            >
              <CrochetBagIcon size={20} />
              <span className="isamar-crochet-bag-count">{totalPiezas}</span>
            </button>
          </div>
        </nav>
      </header>

      <section className="isamar-hero">
        <div className="isamar-hero__content">
          <span
            style={{
              display: "inline-block",
              width: "fit-content",
              padding: "5px 14px",
              borderRadius: "999px",
              border: "1px solid #D8CFCB",
              fontSize: "0.72rem",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#460809",
            }}
          >
            PRIMERA COLECCIÓN
          </span>

          <h1 className="isamar-hero__title">
            Lleva contigo lo hecho a mano
          </h1>

          <p className="isamar-hero__text">
            Bolsos y cosmetiqueras que realzan tu esencia con estilo y autenticidad.
          </p>

          <div className="isamar-hero__actions">
            <a href="#catalogo" className="isamar-btn isamar-btn--primary">
              Explorar catálogo →
            </a>
          </div>
        </div>

        <div className="isamar-hero__visual">
          <img
            src={fotoHero}
            alt="Bolso Tejido Elegancia - Colección ISAMAR"
            className="isamar-hero__img"
            onError={(e) => {
              if (e.currentTarget.src !== window.location.origin + fotoRespaldo) {
                e.currentTarget.src = fotoRespaldo;
              }
            }}
          />
        </div>
      </section>

      <main
        id="catalogo"
        style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px 20px 56px" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "12px",
            flexWrap: "wrap",
            marginBottom: "32px",
          }}
        >
          {categorias.map((cat) => {
            const activa = categoriaActiva === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoriaActiva(cat)}
                style={{
                  padding: "10px 24px",
                  borderRadius: "999px",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  border: activa ? "1px solid #460809" : "1px solid #D8CFCB",
                  backgroundColor: activa ? "#460809" : "#FFFFFF",
                  color: activa ? "#FFFFFF" : "#1A1A1A",
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {termino && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              flexWrap: "wrap",
              marginBottom: "20px",
              fontSize: "0.9rem",
              color: "#460809",
            }}
          >
            <span>
              Resultados para <strong>"{busqueda.trim()}"</strong> ({productosFiltrados.length})
            </span>
            <button
              type="button"
              onClick={() => setBusqueda("")}
              style={{
                background: "transparent",
                border: "1px solid #460809",
                color: "#460809",
                borderRadius: "999px",
                padding: "3px 12px",
                fontSize: "0.8rem",
                cursor: "pointer",
              }}
            >
              Limpiar filtro
            </button>
          </div>
        )}

        {productosFiltrados.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "48px 20px",
              border: "1px solid #EAE3E0",
              borderRadius: "12px",
              backgroundColor: "#FAF8F7",
            }}
          >
            <p style={{ margin: "0 0 12px", fontSize: "1rem", color: "#460809", fontWeight: 600 }}>
              No encontramos piezas con "{busqueda.trim()}".
            </p>
            <button
              type="button"
              onClick={() => {
                setBusqueda("");
                setCategoriaActiva("Todos");
              }}
              className="isamar-btn isamar-btn--primary"
            >
              Ver todo el catálogo
            </button>
          </div>
        ) : (
          <section
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: "24px",
            }}
          >
            {productosFiltrados.map((producto) => (
              <ProductCard
                key={producto.id}
                producto={producto}
                whatsappNumero={catalogoData.whatsappNumero}
                onSelectProduct={(prod, variante) =>
                  setSeleccion({ producto: prod, variante })
                }
                onAddToCart={handleAgregarAlCarrito}
              />
            ))}
          </section>
        )}
      </main>

      <section
        id="detalles"
        style={{
          maxWidth: "1200px",
          margin: "0 auto 48px",
          padding: "0 20px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            alignItems: "center",
            gap: "28px",
            borderTop: "1px solid #EAE3E0",
            borderBottom: "1px solid #EAE3E0",
            padding: "28px 0",
          }}
        >
          <div style={{ height: "240px", overflow: "hidden", borderRadius: "10px", backgroundColor: "#FAF8F7", display: "flex", alignItems: "center", justifyContent: "center", padding: "12px" }}>
            <img
              src={fotoDetalle}
              alt="Detalle del tejido artesanal ISAMAR"
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
              onError={(e) => {
                if (e.currentTarget.src !== window.location.origin + fotoHero) {
                  e.currentTarget.src = fotoHero;
                }
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "24px",
              flexWrap: "wrap",
              textAlign: "left",
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.6rem",
                  fontWeight: 700,
                  color: "#460809",
                }}
              >
                ISAMAR
              </div>
              <div
                style={{
                  fontSize: "0.65rem",
                  letterSpacing: "0.14em",
                  color: "#5E3125",
                }}
              >
                ARTESANÍA CON IDENTIDAD
              </div>
            </div>

            <div
              style={{
                width: "1px",
                height: "44px",
                backgroundColor: "#460809",
                opacity: 0.35,
              }}
            />

            <p
              style={{
                fontFamily: "var(--font-display)",
                fontStyle: "italic",
                fontSize: "1.35rem",
                color: "#460809",
                margin: 0,
              }}
            >
              Detalles que hacen la diferencia.
            </p>
          </div>
        </div>
      </section>

      <footer
        id="footer-isamar"
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "16px 20px 36px",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
        }}
      >
        <div>
          <strong
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.35rem",
              color: "#460809",
              display: "block",
            }}
          >
            ISAMAR
          </strong>
          <span
            style={{
              fontSize: "0.65rem",
              letterSpacing: "0.14em",
              color: "#5E3125",
            }}
          >
            ARTESANÍA CON IDENTIDAD
          </span>
        </div>

        <div style={{ display: "flex", gap: "20px", fontSize: "0.9rem" }}>
          <a href="#inicio">Inicio</a>
          <a href="#catalogo">Tienda</a>
          <a href="#detalles">Nosotros</a>
          <a href="#footer-isamar">Contacto</a>
        </div>

        <span style={{ fontSize: "0.85rem", color: "#5E3125" }}>
          {catalogoData.marca}
        </span>
      </footer>

      <ProductDetailModal
        producto={seleccion?.producto || null}
        varianteInicial={seleccion?.variante || null}
        whatsappNumero={catalogoData.whatsappNumero}
        onClose={() => setSeleccion(null)}
        onAddToCart={handleAgregarAlCarrito}
      />

      <CrochetCartDrawer
        abierto={carritoAbierto}
        onClose={() => setCarritoAbierto(false)}
        items={carrito}
        whatsappNumero={catalogoData.whatsappNumero}
        onIncrementar={handleIncrementar}
        onDecrementar={handleDecrementar}
        onEliminar={handleEliminar}
        onVaciar={handleVaciar}
      />
    </div>
  );
}


