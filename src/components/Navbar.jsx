import "../style/style.css";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function Navbar() {
  const [cartCount, setCartCount] = useState(0);
  const [rol, setRol] = useState(null);
  const navigate = useNavigate();

 const handleLogout = (e) => {
  e.preventDefault();                      
  sessionStorage.clear();                    
  navigate("/inicio-sesion?forceLogin=true", { replace: true }); 
};
  useEffect(() => {
  
   
    const storedRol = sessionStorage.getItem("rol");
    setRol(storedRol);
    const storedCart = JSON.parse(sessionStorage.getItem("cart")) || [];
    const total = storedCart.reduce((sum, item) => sum + item.cantidad, 0);
    setCartCount(total);

    const handleCartUpdated = () => {
      const updated = JSON.parse(sessionStorage.getItem("cart")) || [];
      const totalUpdated = updated.reduce(
        (sum, item) => sum + item.cantidad,
        0
      );
      setCartCount(totalUpdated);
    };

   
    window.addEventListener("cartUpdated", handleCartUpdated);

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdated);
    };
  }, []);

  return (
    <header>
      <nav className="nav">
        <img
          src="/assets/img/Logos/Header.png"
          alt="Pastelería Wonderland"
          className="logo-img"
        />
        <ul className="menu">
          <li className="menu-item">
            <Link to="/home" className="text-decoration-none">
              Inicio
            </Link>
          </li>

                  <li className="menu-item has-children">
            <Link to="/productos" className="text-decoration-none">
              Productos <span className="arrow">▾</span>
            </Link>
            <ul className="sub-menu">
              <li className="menu-item">
                <Link to="/productos?categoria=Tortas Cuadradas">
                  Tortas Cuadradas
                </Link>
              </li>
              <li className="menu-item">
                <Link to="/productos?categoria=Tortas Circulares">
                  Tortas Circulares
                </Link>
              </li>
              <li className="menu-item">
                <Link to="/productos?categoria=Postres Individuales">
                  Postres
                </Link>
              </li>
              <li className="menu-item">
                <Link to="/productos?categoria=Pastelería Tradicional">
                  Pastelería Tradicional
                </Link>
              </li>
              <li className="menu-item">
                <Link to="/productos?categoria=Productos Sin Azúcar">
                  Sin Azúcar
                </Link>
              </li>
              <li className="menu-item">
                <Link to="/productos?categoria=Productos Sin Gluten">
                  Sin Gluten
                </Link>
              </li>
              <li className="menu-item">
                <Link to="/productos?categoria=Productos Veganos">
                  Vegano
                </Link>
              </li>
              <li className="menu-item">
                <Link to="/productos?categoria=Tortas Especiales">
                  Tortas Especiales
                </Link>
              </li>
            </ul>
          </li>

          <li className="menu-item">
            <Link to="/contacto" className="text-decoration-none">
              Contáctanos
            </Link>
          </li>

          <li className="menu-item">
            <Link to="/inicio-sesion" className="text-decoration-none">
              Mi Cuenta
            </Link>
          </li>
          
          {rol === "ADMIN" && (
        <li className="menu-item">
          <Link to="/administracion" className="text-decoration-none">
            Panel Administrador
          </Link>
        </li>
      )}

          <li className="menu-item">
  <Link
    to="#"
    className="text-decoration-none"
    onClick={handleLogout}
  >
    Cerrar sesión
  </Link>
</li>

        </ul>
        <Link
          to="/carro-de-compras"
          className="action-btn text-decoration-none position-relative"
        >
          <i className="bi bi-cart3 me-2"></i>
          Carro de Compras
          {cartCount > 0 && (
            <span
              className="position-absolute top-0 start-100 translate-middle badge rounded-pill"
              style={{
                backgroundColor: "#b1976b",
                fontSize: "0.7rem",
                color: "white",
                fontWeight: "500",
              }}
            >
              {cartCount}
            </span>
          )}
        </Link>
      </nav>
    </header>
  );
}

export default Navbar;
