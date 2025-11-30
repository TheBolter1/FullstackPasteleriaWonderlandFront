import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import axios from "../api/axiosConfig"; 

function Login() {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const forceLogin = params.get("forceLogin");


  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const rol = sessionStorage.getItem("rol");

    if (!forceLogin && token) {
      navigate(rol === "ADMIN" ? "/administracion" : "/home");
    }
  }, [navigate, forceLogin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:9090/api/user/login",
        {
          correo,
          contrasena,
        }
      );

      const data = response.data;

  
      sessionStorage.setItem("token", data.token);
      sessionStorage.setItem("correo", data.correo);
      sessionStorage.setItem("rol", data.rol);
      sessionStorage.setItem("nombres", data.nombres || "");
      sessionStorage.setItem("apellidos", data.apellidos || "");


      if (data.rol === "ADMIN") {
        navigate("/administracion");
      } else {
        navigate("/home");
      }
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Credenciales incorrectas ❌");
      } else {
        setError("Error al conectar con el servidor");
      }
    }
  };

  return (
    <div className="login-page vh-100 d-flex flex-column">

      <header>
        <nav className="nav">
          <Link to="/home">
            <img
              src="/assets/img/Logos/Header.png"
              alt="Pastelería Wonderland"
              className="logo-img"
            />
          </Link>
        </nav>
      </header>


      <main>
        <div className="wrap" id="Login">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2>
                Inicio de Sesión <span className="title-underline"></span>
              </h2>

              {error && <div className="alert alert-danger">{error}</div>}

              <form onSubmit={handleSubmit} noValidate>
                <div className="field mb-3">
                  <label className="label" htmlFor="correo">
                    CORREO
                  </label>
                  <input
                    id="correo"
                    type="email"
                    className={`form-control ${error ? "is-invalid" : ""}`}
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    onFocus={() => setError("")}
                    required
                  />
                </div>

                <div className="field mb-2">
                  <label className="label" htmlFor="contrasena">
                    CONTRASEÑA
                  </label>
                  <input
                    id="contrasena"
                    type="password"
                    className={`form-control ${error ? "is-invalid" : ""}`}
                    value={contrasena}
                    onChange={(e) => setContrasena(e.target.value)}
                    onFocus={() => setError("")}
                    required
                  />
                </div>

                <div className="links mb-3 text-end">
                  <a href="#" className="small text-decoration-none">
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>

                <div className="actions d-flex gap-2">
                  <button className="btn btn-primary flex-grow-1" type="submit">
                    Acceder
                  </button>

                  <Link to="/register" className="btn btn-outline flex-grow-1">
                    Crear cuenta
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

 
      <footer id="site-footer-login" className="mt-auto py-3">
        <div className="footer-content text-center">
          <p className="mb-1">&copy; Pastelería Wonderland — 2025</p>
          <a href="#" className="small text-decoration-none">
            Política de privacidad
          </a>
        </div>
      </footer>
    </div>
  );
}

export default Login;
