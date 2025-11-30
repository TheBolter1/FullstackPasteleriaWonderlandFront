import { useState } from "react";
import EmpleadoForm from "./FormularioEmpleado";

function SeccionEmpleados({ empleados, setEmpleados, loading }) {
  const [accion, setAccion] = useState("mostrar");
  const [empleadoEdit, setEmpleadoEdit] = useState(null);

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

  const handleGuardarEmpleado = (empleado) => {
    const empleadoConApellidos = {
      ...empleado,
      apellidos: `${empleado.apellido1} ${empleado.apellido2}`.trim(),
    };

    if (accion === "editar") {
      setEmpleados(
        empleados.map((e) => (e.rut === empleado.rut ? empleadoConApellidos : e))
      );
    } else {
      setEmpleados([...empleados, empleadoConApellidos]);
    }

    setEmpleadoEdit(empleadoConApellidos);
    setAccion("editar");
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
