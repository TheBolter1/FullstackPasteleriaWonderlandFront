import { useEffect, useState } from "react";
import axios from "axios";

function TopProductos() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    // Llamada al backend
    axios
      .get("http://localhost:9090/api/producto") // ← puerto corregido
      .then((response) => {
        const catalogo = response.data; // asumimos que el backend devuelve un array de productos

        // Normalizar campos (por si backend usa nombreProducto / idProducto)
        const catalogoNormalizado = catalogo.map((prod) => ({
          id: prod.id || prod.idProducto,
          nombre: prod.nombre || prod.nombreProducto,
          imagen: prod.imagen,
          categoria: prod.categoria,
          precio: prod.precio,
          ventas: prod.ventas || 0,
        }));

        // Agregar ventas semanales aleatorias (ejemplo)
        const catalogoConVentas = catalogoNormalizado.map((prod) => ({
          ...prod,
          ventasSemanales: Math.floor(Math.random() * (60 - 5 + 1)) + 5,
        }));

        // Top 10
        const top10 = catalogoConVentas.slice(0, 10);
        setProductos(top10);
      })
      .catch((error) => {
        console.error("Error al cargar los productos:", error);
        setProductos([]); // en caso de error dejamos el array vacío
      });
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">
        <span style={{ display: "inline-block", marginRight: "8px" }}>🍰</span>
        Top 10 Productos Críticos
      </h2>

      <div
        className="d-flex flex-row overflow-auto p-3 gap-3"
        style={{
          border: "1px solid #ddd",
          borderRadius: "12px",
          backgroundColor: "#fff",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          scrollBehavior: "smooth",
        }}
      >
        {productos.length > 0 ? (
          productos.map((prod, index) => (
            <div
              key={prod.id}
              className="p-3 text-center"
              style={{
                minWidth: "250px",
                border: "1px solid #e0e0e0",
                borderRadius: "10px",
                backgroundColor: "#fdfaf9",
                transition: "transform 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <h5 className="mb-2 text-primary">#{index + 1}</h5>
              {prod.imagen && (
                <img
                  src={prod.imagen}
                  alt={prod.nombre}
                  className="d-block mx-auto mb-2"
                  style={{ width: "100px", height: "100px", objectFit: "cover" }}
                />
              )}
              <p className="mb-1">
                <strong>ID:</strong> {prod.id}
              </p>
              <p className="mb-1">
                <strong>Nombre:</strong> {prod.nombre}
              </p>
              <p className="mb-0">
                <strong>Ventas semanales:</strong> {prod.ventasSemanales} unidades
              </p>
            </div>
          ))
        ) : (
          <p className="text-center w-100">No hay productos disponibles.</p>
        )}
      </div>
    </div>
  );
}

export default TopProductos;
