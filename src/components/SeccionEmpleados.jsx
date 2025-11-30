import { useState } from "react";
import EmpleadoForm from "./FormularioEmpleado";
import axios from "../api/axiosConfig";

function SeccionEmpleados({ empleados, setEmpleados, loading }) {
  const [accion, setAccion] = useState("mostrar");
  const [empleadoEdit, setEmpleadoEdit] = useState(null);
  const [saving, setSaving] = useState(false);

  const iniciarAgregar = () => {
    setEmpleadoEdit(null);
    setAccion("agregar");
  };

  const iniciarEditar = (empleado) => {
    if (!empleado) return alert("Selecciona un empleado de la tabla primero");
    setEmpleadoEdit(empleado);
    setAccion("editar");
  };

  const cancelar = () => setAccion("mostrar");

  const handleGuardarEmpleado = async (empleado) => {
    setSaving(true);

    const apellidos = `${empleado.apellido1 || ""} ${
      empleado.apellido2 || ""
    }`.trim();

    const payload = {
      rut: empleado.rut,
      dv: empleado.dv,
      nombres: empleado.nombres,
      apellidos,
      correo: empleado.correo,
      telefono: empleado.telefono,
      cargo: empleado.cargo,
      direccion: empleado.direccion,
      fecha_nacimiento: empleado.fecha_nacimiento,
    };

    try {
      let res;
      let guardado;

      if (accion === "editar") {
        res = await axios.put(`/api/empleados/${empleado.rut}`, payload);
        guardado = res.data;

        setEmpleados((prev) =>
          prev.map((e) => (e.rut === guardado.rut ? guardado : e))
        );

        alert("Empleado actualizado correctamente");
      } else {
        res = await axios.post("/api/empleados", payload);
        guardado = res.data;

        setEmpleados((prev) => [...prev, guardado]);
        alert("Empleado creado correctamente");
      }

      setEmpleadoEdit(guardado);
      setAccion("editar");
    } catch (error) {
      console.error("Error guardando empleado:", error);
      alert("Ocurrió un error al guardar el empleado");
    } finally {
      setSaving(false);
    }
  };

  const handleEliminarEmpleado = async () => {
    if (!empleadoEdit) {
      alert("Selecciona un empleado de la tabla primero");
      return;
    }

    const confirmar = window.confirm(
      `¿Seguro que deseas eliminar al empleado con RUT "${empleadoEdit.rut}"?`
    );
    if (!confirmar) return;

    try {
      await axios.delete(`/api/empleados/${empleadoEdit.rut}`);

      setEmpleados((prev) =>
        prev.filter((e) => e.rut !== empleadoEdit.rut)
      );

      setEmpleadoEdit(null);
      setAccion("mostrar");
      alert("Empleado eliminado correctamente");
    } catch (error) {
      console.error("Error eliminando empleado:", error);
      alert("Ocurrió un error al eliminar el empleado");
    }
  };

  return (
    <div className="d-flex">
      {(accion === "agregar" || accion === "editar") && (
        <div
          className="bg-white shadow-sm p-3 border rounded flex-shrink-0"
          style={{
            width: "350px",
            maxHeight: "80vh",
            overflowY: "auto",
            transition: "all 0.3s",
          }}
        >
          <EmpleadoForm
            empleadoEdit={empleadoEdit}
            handleGuardar={handleGuardarEmpleado}
            cancelar={cancelar}
            saving={saving}
          />
        </div>
      )}

      <div className="flex-grow-1 ms-3">
        <h2 className="h4 mb-3">Administración de Empleados</h2>

        <div className="d-flex gap-2 mb-3">
          <button className="btn btn-primary" onClick={iniciarAgregar}>
            Agregar
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => iniciarEditar(empleadoEdit)}
          >
            Modificar
          </button>
          <button
            className="btn btn-danger"
            onClick={handleEliminarEmpleado}
          >
            Eliminar
          </button>
          <button className="btn btn-outline-secondary" onClick={cancelar}>
            Mostrar
          </button>
        </div>

        <div className="card shadow-sm mt-3">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>RUT</th>
                  <th>Nombres</th>
                  <th>Apellidos</th>
                  <th>Cargo</th>
                  <th>Correo</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="text-center text-muted">
                      Cargando empleados...
                    </td>
                  </tr>
                ) : empleados.length > 0 ? (
                  empleados.map((e) => (
                    <tr
                      key={e.rut}
                      onClick={() => setEmpleadoEdit(e)}
                      style={{
                        cursor: "pointer",
                        backgroundColor:
                          empleadoEdit?.rut === e.rut
                            ? "#f0f0f0"
                            : "transparent",
                      }}
                    >
                      <td>{e.rut}</td>
                      <td>{e.nombres}</td>
                      <td>{e.apellidos}</td>
                      <td>{e.cargo}</td>
                      <td>{e.correo}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={(ev) => {
                            ev.stopPropagation();
                            iniciarEditar(e);
                          }}
                        >
                          Editar
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center text-muted">
                      No hay empleados
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SeccionEmpleados;
