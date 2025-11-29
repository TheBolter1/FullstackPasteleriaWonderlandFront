import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import AlertaSimple from "../components/AlertaSimple.jsx";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../style/style.css";

document.title = "Productos | Pastelería Wonderland";

function Productos() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoria = queryParams.get("categoria");

  const [productos, setProductos] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const productosPorPagina = 8;
  const [loading, setLoading] = useState(true);
  const [alerta, setAlerta] = useState({ msg: "", type: "" });
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [mostrarModal, setMostrarModal] = useState(false);

  // Cargar productos
  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:8080/api/producto")
      .then((res) => {
        const productosFiltrados = categoria
          ? res.data.filter((p) => p.categoria === categoria)
          : res.data;

        setProductos(productosFiltrados);
        setPaginaActual(1);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error cargando productos:", err);
        setLoading(false);
      });
  }, [categoria]);

  // Paginación
  const indexInicio = (paginaActual - 1) * productosPorPagina;
  const indexFin = indexInicio + productosPorPagina;
  const productosPagina = productos.slice(indexInicio, indexFin);
  const totalPaginas = Math.ceil(productos.length / productosPorPagina);

  const siguientePagina = () => {
    if (paginaActual < totalPaginas) setPaginaActual(paginaActual + 1);
  };

  const anteriorPagina = () => {
    if (paginaActual > 1) setPaginaActual(paginaActual - 1);
  };

  // Modal agregar al carrito
  const abrirModal = (producto) => {
    setProductoSeleccionado(producto);
    setCantidad(1);
    setMostrarModal(true);
  };

  const agregarAlCarrito = () => {
    if (!productoSeleccionado) {
      setAlerta({
        msg: "Debes seleccionar un producto antes de agregar al carrito.",
        type: "warning",
      });
      return;
    }

    const nuevoItem = {
      id: productoSeleccionado.idProducto,
      nombre: productoSeleccionado.nombreProducto,
      precio: productoSeleccionado.precio,
      imagen: productoSeleccionado.imagen,
      cantidad,
    };

    const carritoActual = JSON.parse(localStorage.getItem("cart")) || [];

    const existente = carritoActual.find((p) => p.id === nuevoItem.id);

    if (existente) {
      existente.cantidad = Math.min(existente.cantidad + cantidad, 8);
      setAlerta({
        msg: `${nuevoItem.nombre} ya estaba en el carrito. Cantidad actualizada.`,
        type: "info",
      });
    } else {
      carritoActual.push(nuevoItem);
      setAlerta({
        msg: `${nuevoItem.nombre} agregado al carrito.`,
        type: "success",
      });
    }

    localStorage.setItem("cart", JSON.stringify(carritoActual));
    window.dispatchEvent(new Event("cartUpdated"));

    setMostrarModal(false);
  };

  return (
    <>
      <Navbar />
      <AlertaSimple
        message={alerta.msg}
        type={alerta.type}
        onClose={() => setAlerta({ msg: "", type: "" })}
      />

      <div id="banner-contacto">
        <img
          src="/assets/img/Banner/productos.webp"
          alt="Pastelería Wonderland"
          className="banner opacity-75"
        />
        <p id="letra-b-producto">
          {categoria ? categoria : "Nuestros Productos"}
        </p>
      </div>

      <main className="container mt-4">
        {/* Botones de paginación */}
        <div className="d-flex justify-content-center mt-4 mb-2 gap-2">
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={anteriorPagina}
            disabled={paginaActual === 1}
          >
            « Anterior
          </button>
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={siguientePagina}
            disabled={paginaActual === totalPaginas}
          >
            Siguiente »
          </button>
        </div>

        {/* Productos */}
        <div
          id="productos-container"
          className="row g-3 justify-content-center"
          style={{ maxHeight: "70vh", overflowY: "auto", paddingRight: "10px" }}
        >
          {loading ? (
            <p>Cargando productos...</p>
          ) : productosPagina.length > 0 ? (
            productosPagina.map((prod) => (
              <div
                key={prod.idProducto}
                className="col-12 col-sm-6 col-md-4 col-lg-3 d-flex"
              >
                <ProductCard
                  producto={prod}
                  onAddToCart={() => abrirModal(prod)}
                />
              </div>
            ))
          ) : (
            <p>No hay productos disponibles.</p>
          )}
        </div>

        {/* Botones de paginación abajo */}
        <div className="d-flex justify-content-center mt-3 gap-2">
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={anteriorPagina}
            disabled={paginaActual === 1}
          >
            « Anterior
          </button>
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={siguientePagina}
            disabled={paginaActual === totalPaginas}
          >
            Siguiente »
          </button>
        </div>
      </main>

      {/* Modal */}
      {mostrarModal && (
        <div
          className="modal fade show"
          style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Agregar {productoSeleccionado?.nombreProducto}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setMostrarModal(false)}
                ></button>
              </div>
              <div className="modal-body text-center">
                <p>Selecciona la cantidad (máx. 8):</p>
                <input
                  type="number"
                  min="1"
                  max="8"
                  value={cantidad}
                  onChange={(e) =>
                    setCantidad(
                      Math.max(1, Math.min(8, Number(e.target.value)))
                    )
                  }
                  className="form-control w-50 mx-auto text-center"
                />
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setMostrarModal(false)}
                >
                  Cancelar
                </button>
                <button className="btn btn-success" onClick={agregarAlCarrito}>
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

export default Productos;
