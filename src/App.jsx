import { useState } from "react";
import catalogoData from "./data/catalogoInicial.json";
import ProductCard from "./components/ProductCard";
import ProductDetailModal from "./components/ProductDetailModal";

export default function App() {
  const [seleccion, setSeleccion] = useState(null);

  return (
    <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 20px" }}>
      <header style={{ marginBottom: "28px" }}>
        <p
          style={{
            fontSize: "0.85rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#5E3125",
          }}
        >
          Catálogo Interactivo · Paso 2
        </p>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "2.2rem",
            color: "#460809",
          }}
        >
          {catalogoData.marca}
        </h1>
      </header>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))",
          gap: "24px",
        }}
      >
        {catalogoData.productos.map((producto) => (
          <ProductCard
            key={producto.id}
            producto={producto}
            whatsappNumero={catalogoData.whatsappNumero}
            onSelectProduct={(prod, variante) =>
              setSeleccion({ producto: prod, variante })
            }
          />
        ))}
      </section>

      <ProductDetailModal
        producto={seleccion?.producto || null}
        varianteInicial={seleccion?.variante || null}
        whatsappNumero={catalogoData.whatsappNumero}
        onClose={() => setSeleccion(null)}
      />
    </main>
  );
}