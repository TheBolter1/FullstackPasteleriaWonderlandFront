
import { useNavigate } from "react-router-dom"; 
import DetalleProducto from "../pages/DetalleProducto.jsx";

function ProductCard({ producto, onAddToCart }) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/producto/${producto.id}`);
  };

  return (
    <div className="producto-card card shadow-sm" style={{ cursor: "pointer" }}
      onClick={handleCardClick}>
      <img
        src={producto.imagen}
        alt={producto.nombre}
        className="card-img-top"
      />
      <div className="card-body text-center">
        <h5 className="card-title">{producto.nombre}</h5>
        <p className="card-text fw-bold">${producto.precio.toLocaleString()}</p>
        <button
          className="btn btn-primary mt-auto"
          onClick={(e) => {
            e.stopPropagation(); 
            onAddToCart(producto); 
          }}
        >
          Agregar al carrito
        </button>
      </div>
    </div>
  );
}

export default ProductCard;