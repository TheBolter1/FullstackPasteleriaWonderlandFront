import { useState, useEffect } from "react";
import axios from "../api/axiosConfig";

function BandejaContacto() {
  const [mensajes, setMensajes] = useState([]);
  const [mensajeSeleccionado, setMensajeSeleccionado] = useState(null);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    let isMounted = true;

    const cargarMensajes = async () => {
      try {
        const res = await axios.get("/api/mensajes");
        if (isMounted) {
          setMensajes(res.data || []);
        }
      } catch (err) {
        console.error("Error cargando mensajes:", err);
        if (isMounted) {
          setMensajes([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    cargarMensajes();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div>
      <h2 className="h4 mb-3">Bandeja de contacto</h2>
      <p className="text-muted">Mensajes recibidos desde el formulario.</p>

      <div className="card shadow-sm">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Fecha</th>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Orden</th>
                <th>Mensaje</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center text-muted">
                    Cargando mensajes...
                  </td>
                </tr>
              ) : mensajes.length > 0 ? (
                mensajes.map((m) => (
                  <tr key={m.id}>
                    <td>{m.fecha}</td>
                    <td>{m.nombre}</td>
                    <td>{m.correo}</td>
                    <td>{m.orden || "-"}</td>
                    <td>
                      {m.mensaje && m.mensaje.length > 50
                        ? m.mensaje.substring(0, 50) + "..."
                        : m.mensaje}
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => setMensajeSeleccionado(m)}
                      >
                        Ver completo
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center text-muted">
                    No hay mensajes para mostrar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {mensajeSeleccionado && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
          onClick={() => setMensajeSeleccionado(null)}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: "1.5rem",
              borderRadius: "8px",
              maxWidth: "600px",
              width: "90%",
              maxHeight: "80%",
              overflowY: "auto",
              boxShadow: "0 0 10px rgba(0,0,0,0.3)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h5>Mensaje de {mensajeSeleccionado.nombre}</h5>
            <p className="text-muted mb-1">
              <strong>Correo:</strong> {mensajeSeleccionado.correo}
            </p>
            {mensajeSeleccionado.orden && (
              <p className="text-muted mb-2">
                <strong>Orden:</strong> {mensajeSeleccionado.orden}
              </p>
            )}
            <p>{mensajeSeleccionado.mensaje}</p>
            <div className="text-end">
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setMensajeSeleccionado(null)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BandejaContacto;
