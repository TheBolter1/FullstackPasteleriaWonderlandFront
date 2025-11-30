import { useState, useEffect } from "react";
import axios from "../api/axiosConfig";

function PerfilAdmin() {
  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    correo: "",
  });

  const [editando, setEditando] = useState(false);

  // Cargar usuario desde sessionStorage al entrar
  useEffect(() => {
    const nombres = sessionStorage.getItem("nombres") || "";
    const apellidos = sessionStorage.getItem("apellidos") || "";
    const correo = sessionStorage.getItem("correo") || "";

    setFormData({ nombres, apellidos, correo });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGuardar = async (e) => {
  e.preventDefault();

  try {
    // 1️⃣ Obtener el usuario completo usando el correo
    const res = await axios.get(`/api/user/correo/${formData.correo}`);
    const adminActual = res.data;

    // 2️⃣ Crear el payload completo manteniendo lo que no cambió
    const payload = {
      ...adminActual,
      nombres: formData.nombres,
      apellidos: formData.apellidos,
      correo: formData.correo
    };

    // 3️⃣ Hacer el PUT con ID real
    await axios.put(`/api/user/${adminActual.id}`, payload);

    // 4️⃣ Actualizar sessionStorage
    sessionStorage.setItem("nombres", payload.nombres);
    sessionStorage.setItem("apellidos", payload.apellidos);
    sessionStorage.setItem("correo", payload.correo);

    setEditando(false);
    alert("Perfil actualizado correctamente ✅");

  } catch (err) {
    console.error("ERROR PUT:", err.response?.data || err);
    alert("Error al actualizar el perfil ❌");
  }
};

  return (
    <div className="card shadow-sm p-4" data-testid="perfil-admin">
      <h2 className="h5 mb-3">Perfil Administrador</h2>

      <form onSubmit={handleGuardar}>
        <div className="mb-3">
          <label className="form-label fw-semibold">Nombres</label>
          <input
            type="text"
            name="nombres"
            className="form-control"
            value={formData.nombres}
            onChange={handleChange}
            disabled={!editando}
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Apellidos</label>
          <input
            type="text"
            name="apellidos"
            className="form-control"
            value={formData.apellidos}
            onChange={handleChange}
            disabled={!editando}
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Correo</label>
          <input
            type="email"
            name="correo"
            className="form-control"
            value={formData.correo}
            onChange={handleChange}
            disabled
          />
        </div>

        <div className="d-flex justify-content-end">
          {editando ? (
            <>
              <button
                type="button"
                className="btn btn-outline-secondary me-2"
                onClick={() => setEditando(false)}
              >
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary">
                Guardar
              </button>
            </>
          ) : (
            <button
              type="button"
              className="btn btn-skin"
              onClick={() => setEditando(true)}
            >
              Editar Perfil
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default PerfilAdmin;
