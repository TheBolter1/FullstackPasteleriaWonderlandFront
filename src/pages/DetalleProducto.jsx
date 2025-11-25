import { useNavigate, useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import AlertaSimple from "../components/AlertaSimple.jsx";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Recomendados from "../components/Recomendados";
import "../style/style.css";

document.title = "Detalle de producto | Pastelería Wonderland";

function DetalleProducto() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [alerta, setAlerta] = useState({ msg: "", type: "" });

  // Cargar producto desde el backend
  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/producto/${id}`);
        setProducto(res.data);
      } catch (error) {
        setAlerta({ msg: "Producto no encontrado", type: "danger" });
        navigate("/productos");
      }
    };
    fetchProducto();
  }, [id, navigate]);

  const aumentarCantidad = () => {
    if (cantidad < 8) setCantidad(cantidad + 1);
    else setAlerta({ msg: "Cantidad máxima: 8 unidades", type: "warning" });
  };

  const disminuirCantidad = () => {
    if (cantidad > 1) setCantidad(cantidad - 1);
  };

  const agregarAlCarrito = () => {
    if (!producto) return;

    const carritoActual = JSON.parse(localStorage.getItem("cart")) || [];
    const existente = carritoActual.find((p) => p.id === producto.id);

    if (existente) {
      const nuevaCantidad = Math.min(existente.cantidad + cantidad, 8);
      if (existente.cantidad + cantidad > 8) {
        setAlerta({ msg: "Cantidad máxima: 8 unidades", type: "warning" });
      }
      existente.cantidad = nuevaCantidad;
    } else {
      carritoActual.push({ ...producto, cantidad });
    }

    localStorage.setItem("cart", JSON.stringify(carritoActual));
    window.dispatchEvent(new Event("cartUpdated"));
    setAlerta({
      msg: `${producto.nombre} agregado al carrito (${cantidad} unidad${cantidad > 1 ? "es" : ""})`,
      type: "success",
    });
  };

  if (!producto) {
    return (
      <>
        <Navbar />
        <div className="container mt-5 text-center">
          <h2>Cargando producto...</h2>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <AlertaSimple
        message={alerta.msg}
        type={alerta.type}
        onClose={() => setAlerta({ msg: "", type: "" })}
      />
      <div className="container-fluid py-5 px-md-5 bg-light">
        <div className="container-lg p-4 bg-white rounded-4 shadow-sm">
          <nav aria-label="breadcrumb" className="mb-4">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link to="/" className="text-decoration-none text-secondary">Inicio</Link>
              </li>
              <li className="breadcrumb-item">
                <Link to="/productos" className="text-decoration-none text-secondary">Productos</Link>
              </li>
              <li className="breadcrumb-item active text-dark" aria-current="page">
                {producto?.nombre || "Producto"}
              </li>
            </ol>
          </nav>

          <div className="row align-items-center g-5">
            <div className="col-lg-6 col-md-6 text-center">
              <img
                src={producto?.imagen}
                alt={producto?.nombre}
                className="img-fluid rounded-4 shadow"
                style={{ maxHeight: "480px", width: "100%", objectFit: "cover" }}
              />
            </div>

            <div className="col-lg-6 col-md-6 text-center text-md-start">
              <h2 className="text-uppercase fw-bold display-5 mb-3" style={{ color: "#b1976b" }}>
                {producto?.nombre}
              </h2>
              <h4 className="fw-semibold mb-4" style={{ color: "#6c757d" }}>
                ${producto?.precio?.toLocaleString() || '0'}
              </h4>
              <p className="text-muted" style={{ fontSize: "1rem", lineHeight: "1.8", color: "#6f6f6f", fontWeight: "400", letterSpacing: "0.3px" }}>
                {producto?.descripcion || "Descripción no disponible."}
              </p>

              <div className="d-flex flex-column flex-md-row align-items-center gap-3 mt-4">
                <div className="d-flex align-items-center border rounded" style={{ width: "120px", height: "42px" }}>
                  <button type="button" className="btn btn-sm text-secondary border-0 px-2" style={{ fontSize: "1.3rem", lineHeight: "1" }} onClick={disminuirCantidad}>−</button>
                  <input type="text" value={cantidad} readOnly className="form-control text-center border-0 shadow-none" style={{ width: "50px", backgroundColor: "transparent", fontSize: "1rem", color: "#5a5a5a" }}/>
                  <button type="button" className="btn btn-sm text-secondary border-0 px-2" style={{ fontSize: "1.3rem", lineHeight: "1" }} onClick={aumentarCantidad}>+</button>
                </div>
                <div className="d-flex flex-column flex-sm-row gap-3">
                  <button className="btn text-white fw-semibold px-4 py-2" style={{ backgroundColor: "#b1976b", border: "none", borderRadius: "50px", minWidth: "180px", transition: "all 0.3s ease", whiteSpace: "nowrap" }} onClick={agregarAlCarrito}>
                    <i className="bi bi-cart-plus me-2"></i>Añadir al carrito
                  </button>
                  <button className="btn text-white fw-semibold px-4 py-2" style={{ backgroundColor: "#8a817c", border: "none", borderRadius: "50px", minWidth: "180px", transition: "all 0.3s ease", whiteSpace: "nowrap" }}>
                    Comprar ahora
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Recomendados productoId={producto?.id} />
      <Footer />
    </>
  );
}

export default DetalleProducto;
