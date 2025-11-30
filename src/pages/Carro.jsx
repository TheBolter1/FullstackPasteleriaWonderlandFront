import React, { useState, useEffect, useRef } from "react";
import "../style/style.css";
import { Link } from "react-router-dom";
import AlertaSimple from "../components/AlertaSimple.jsx";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer.jsx";
import CartItem from "../components/CartItem.jsx";

document.title = "Carrito de compras | Pastelería Wonderland";

function Carro() {
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [alerta, setAlerta] = useState({ msg: "", type: "" });

  const loadedOnce = useRef(false);

  useEffect(() => {
    const storedCart = sessionStorage.getItem("cart");
    if (storedCart) {
      const parsed = JSON.parse(storedCart);
      console.log("Carrito cargado (solo una vez):", parsed);
      setCartItems(parsed);
    } else {
      console.log("No hay carrito guardado");
    }
  }, []);

  useEffect(() => {
    if (cartItems.length == 0) return;
    const total = cartItems.reduce(
      (sum, item) => sum + item.precio * item.cantidad,
      0
    );
    setCartTotal(total);
    sessionStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const increaseQuantity = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id && item.cantidad < 8
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      )
    );
  };

  const decreaseQuantity = (id) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, cantidad: Math.max(item.cantidad - 1, 0) }
            : item
        )
        .filter((item) => item.cantidad > 0)
    );
  };

  const removeProduct = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
    setAlerta({ msg: "Producto eliminado del carrito", type: "info" });
  };

  const handleReset = () => {
    if (cartItems.length === 0) {
      setAlerta({ msg: "Tu carrito ya está vacío", type: "info" });
      return;
    }

    sessionStorage.removeItem("cart");
    setCartItems([]);
    setCartTotal(0);
    setAlerta({ msg: "Carrito eliminado con éxito", type: "success" });
  };

  const handleFinalizarCompra = () => {
    if (cartItems.length === 0) {
      setAlerta({
        msg: "Tu carrito está vacío. Agrega productos antes de comprar.",
        type: "warning",
      });
      return;
    }
  };

  return (
    <>
      <Navbar />
      <AlertaSimple
        message={alerta.msg}
        type={alerta.type}
        onClose={() => setAlerta({ msg: "", type: "" })}
      />
      <img
        src="/assets/img/Banner/pedido.webp"
        alt="Pastelería Wonderland"
        className="banner"
      />

      <div className="custom-alert soft">
        ¿Eres cliente?{" "}
        <Link to="/inicio-sesion" className="alert-link">
          Haz clic aquí para acceder
        </Link>
      </div>

      <div className="custom-alert soft">
        <p>Si tienes un cupón, se aplica al finalizar tu compra </p>
      </div>

      <section id="Carrito" className="container my-5">
        <div className="card p-4 shadow">
          <h2 className="mb-4">Carro de Compras</h2>
          <table className="table table-striped table-hover shadow-sm rounded">
            <thead className="table-responsive">
              <tr>
                <th>Producto</th>
                <th>Precio unitario</th>
                <th>Cantidad</th>
                <th>Subtotal</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.length > 0 ? (
                cartItems.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onIncrease={increaseQuantity}
                    onDecrease={decreaseQuantity}
                    onRemove={removeProduct}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">
                    Tu carro de compras está vacío.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="text-end mt-3">
            <Link
              to="/productos"
              className="btn btn-primary text-decoration-none"
            >
              Seguir Comprando
            </Link>
            <button
              type="reset"
              className="btn btn-danger"
              onClick={handleReset}
            >
              Eliminar carrito
            </button>
            <button
              type="button"
              className="btn btn-success"
              onClick={handleFinalizarCompra}
            >
              Finalizar Compra
            </button>
            <h4 className="mt-3 fw-bold text-secondary">
              Total: ${cartTotal.toLocaleString("es-CL")}
            </h4>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

export default Carro;
