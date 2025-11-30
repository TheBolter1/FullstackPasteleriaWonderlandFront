import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Recomendados({ productoId }) {
  const [recomendados, setRecomendados] = useState([]);

  useEffect(() => {
    const fetchRecomendados = async () => {
      try {
        const res = await axios.get("http://localhost:9090/api/producto");
        let lista = res.data || [];

        if (productoId) {
          lista = lista.filter(
            (p) => (p.idProducto ?? p.id) !== productoId
          );
        }

        const aleatorios = [...lista]
          .sort(() => Math.random() - 0.5)
          .slice(0, 3);

        setRecomendados(aleatorios);
      } catch (err) {
        console.error("Error cargando recomendados:", err);
        setRecomendados([]);
      }
    };

    fetchRecomendados();
  }, [productoId]);

  if (!recomendados || recomendados.length === 0) return null;

  return (
    <div className="container-lg my-5">
      <h4 className="text-center text-secondary mb-4">
        También te puede gustar
      </h4>
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4 justify-content-center">
        {recomendados.map((relacionado) => {
          const id = relacionado.idProducto ?? relacionado.id;
          const nombre =
            relacionado.nombreProducto ?? relacionado.nombre;

          return (
            <div
              key={id}
              className="col"
              style={{ maxWidth: "320px" }}
            >
              <div className="card h-100 shadow-sm border-0 rounded-4 overflow-hidden">
                <img
                  src={relacionado.imagen}
                  alt={nombre}
                  className="card-img-top"
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <div className="card-body text-center">
                  <h5 className="card-title fw-medium text-dark mb-2 fs-5">
                    {nombre}
                  </h5>

                  <Link
                    id="Detalle-boton"
                    className="btn btn-sm px-4 text-decoration-none"
                    to={`/producto/${id}`}
                  >
                    <i className="bi bi-eye me-2"></i>Ver Producto
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Recomendados;
