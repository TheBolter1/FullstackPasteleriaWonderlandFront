import { useState, useEffect } from "react";

function EmpleadoForm({ empleadoEdit, handleGuardar, cancelar, saving }) {
  const [formData, setFormData] = useState({
    rut: "",
    dv: "",
    nombres: "",
    apellido1: "",
    apellido2: "",
    correo: "",
    telefono: "",
    cargo: "",
    direccion: "",
    fecha_nacimiento: "",
  });

  useEffect(() => {
    if (empleadoEdit) {
      const [apellido1, ...resto] = (empleadoEdit.apellidos || "")
        .trim()
        .split(" ");
      const apellido2 = resto.join(" ");

      setFormData({
        rut: empleadoEdit.rut || "",
        dv: empleadoEdit.dv || "",
        nombres: empleadoEdit.nombres || "",
        apellido1: empleadoEdit.apellido1 || apellido1 || "",
        apellido2: empleadoEdit.apellido2 || apellido2 || "",
        correo: empleadoEdit.correo || "",
        telefono: empleadoEdit.telefono || "",
        cargo: empleadoEdit.cargo || "",
        direccion: empleadoEdit.direccion || "",
        fecha_nacimiento: empleadoEdit.fecha_nacimiento || "",
      });
    } else {
      setFormData({
        rut: "",
        dv: "",
        nombres: "",
        apellido1: "",
        apellido2: "",
        correo: "",
        telefono: "",
        cargo: "",
        direccion: "",
        fecha_nacimiento: "",
      });
    }
  }, [empleadoEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    await handleGuardar(formData);
  };

  return (
    <section className="card shadow-sm p-3 mt-3">
      <h5>{empleadoEdit ? "Editar Empleado" : "Agregar Empleado"}</h5>
      <form onSubmit={onSubmit}>
        <div className="row g-2">
          <div className="col-md-4">
            <label htmlFor="rut" className="form-label">
              RUT
            </label>
            <input
              id="rut"
              name="rut"
              type="text"
              className="form-control"
              value={formData.rut}
              onChange={handleChange}
              disabled={!!empleadoEdit}
              required
            />
          </div>
          <div className="col-md-2">
            <label htmlFor="dv" className="form-label">
              DV
            </label>
            <input
              id="dv"
              name="dv"
              type="text"
              className="form-control"
              value={formData.dv}
              onChange={handleChange}
              disabled={!!empleadoEdit}
              required
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="nombres" className="form-label">
              Nombres
            </label>
            <input
              id="nombres"
              name="nombres"
              type="text"
              className="form-control"
              value={formData.nombres}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="row g-2 mt-2">
          <div className="col-md-4">
            <label htmlFor="apellido1" className="form-label">
              Apellido 1
            </label>
            <input
              id="apellido1"
              name="apellido1"
              type="text"
              className="form-control"
              value={formData.apellido1}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-4">
            <label htmlFor="apellido2" className="form-label">
              Apellido 2
            </label>
            <input
              id="apellido2"
              name="apellido2"
              type="text"
              className="form-control"
              value={formData.apellido2}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-4">
            <label htmlFor="correo" className="form-label">
              Correo
            </label>
            <input
              id="correo"
              name="correo"
              type="email"
              className="form-control"
              value={formData.correo}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="row g-2 mt-2">
          <div className="col-md-6">
            <label htmlFor="telefono" className="form-label">
              Teléfono
            </label>
            <input
              id="telefono"
              name="telefono"
              type="text"
              className="form-control"
              value={formData.telefono}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="cargo" className="form-label">
              Cargo
            </label>
            <input
              id="cargo"
              name="cargo"
              type="text"
              className="form-control"
              value={formData.cargo}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="mt-2">
          <label htmlFor="direccion" className="form-label">
            Dirección
          </label>
          <input
            id="direccion"
            name="direccion"
            type="text"
            className="form-control"
            value={formData.direccion}
            onChange={handleChange}
          />
        </div>
        <div className="mt-2">
          <label htmlFor="fecha_nacimiento" className="form-label">
            Fecha de nacimiento
          </label>
          <input
            id="fecha_nacimiento"
            name="fecha_nacimiento"
            type="date"
            className="form-control"
            value={formData.fecha_nacimiento}
            onChange={handleChange}
          />
        </div>

        <div className="mt-3 d-flex justify-content-end">
          <button
            type="button"
            className="btn btn-outline-secondary me-2"
            onClick={cancelar}
            disabled={saving}
          >
            Cancelar
          </button>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default EmpleadoForm;
