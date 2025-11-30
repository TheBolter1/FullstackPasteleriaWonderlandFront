import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import HeaderAdmin from "../components/HeaderAdmin";
import SidebarAdmin from "../components/SidebarAdmin";
import BandejaContacto from "../components/BandejaContacto";
import ProductoForm from "../components/ProductoForm";
import SeccionEmpleados from "../components/SeccionEmpleados";
import PerfilAdmin from "../components/PerfilAdmin";
import TopProductos from "../components/TopProductos";

import axios from "../api/axiosConfig";

function Admin() {
  const [empleados, setEmpleados] = useState([]);
  const [loadingEmpleados, setLoadingEmpleados] = useState(true);

  const [productos, setProductos] = useState([]);
  const [loadingProductos, setLoadingProductos] = useState(true);

  const [tabActivo, setTabActivo] = useState("bandeja");
  const [productoEdit, setProductoEdit] = useState(null);
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const navigate = useNavigate();


  useEffect(() => {
    const cargarEmpleados = async () => {
      try {
        const res = await axios.get("/api/empleados");
        console.log("Empleados desde backend:", res.data);
        setEmpleados(res.data || []);
      } catch (err) {
        console.error("Error cargando empleados:", err);
        setEmpleados([]);
      } finally {
        setLoadingEmpleados(false);
      }
    };

    cargarEmpleados();
  }, []);


  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const res = await axios.get("/api/producto");
        console.log("Productos desde backend:", res.data);
        setProductos(res.data || []);
      } catch (err) {
        console.error("Error cargando productos:", err);
        setProductos([]);
      } finally {
        setLoadingProductos(false);
      }
    };

    cargarProductos();
  }, []);

  const toggleSidebar = () => setSidebarVisible(!sidebarVisible);

  const logout = () => {
    sessionStorage.clear();
    navigate("/inicio-sesion?forceLogin=true");
  };

  const handleAgregarProducto = () => {
    setProductoEdit(null);
    setTabActivo("agregarProducto");
  };

  const handleEditarProducto = (producto) => {
    if (!producto) return alert("Selecciona un producto primero");
    setProductoEdit(producto);
    setTabActivo("editarProducto");
  };

  const handleGuardarProducto = async (producto) => {
    try {
      let res;

      if (productoEdit) {
        res = await axios.put(`/api/producto/${producto.id}`, producto);
      } else {
        res = await axios.post("/api/producto", producto);
      }

      const guardado = res.data;

      setProductos((prev) => {
        if (productoEdit) {
          return prev.map((p) => (p.id === guardado.id ? guardado : p));
        } else {
          return [...prev, guardado];
        }
      });

      setProductoEdit(null);
      setTabActivo("bandeja");
    } catch (err) {
      console.error("Error guardando producto:", err);
      alert("Ocurrió un error al guardar el producto");
    }
  };

  const handleEliminarProductoPorId = async () => {
    const id = window.prompt("Ingresa el ID (código) del producto a eliminar:");
    if (!id) return;

    const confirmar = window.confirm(
      `¿Seguro que deseas eliminar el producto con ID "${id}"?`
    );
    if (!confirmar) return;

    try {
      await axios.delete(`/api/producto/${id}`);
      setProductos((prev) =>
        prev.filter((p) => p.id?.toString() !== id.toString())
      );

      setProductoEdit(null);
      setTabActivo("bandeja");
      alert("Producto eliminado correctamente");
    } catch (err) {
      console.error("Error eliminando producto:", err);
      alert("Ocurrió un error al eliminar el producto");
    }
  };

  const handleEliminarEmpleadoPorRut = async () => {
    const rut = window.prompt(
      "Ingresa el RUT del empleado a eliminar (tal como está guardado, sin DV si así lo usas):"
    );
    if (!rut) return;

    const confirmar = window.confirm(
      `¿Seguro que deseas eliminar al empleado con RUT "${rut}"?`
    );
    if (!confirmar) return;

    try {
      await axios.delete(`/api/empleados/${rut}`);

      setEmpleados((prev) =>
        prev.filter((e) => e.rut?.toString() !== rut.toString())
      );

      alert("Empleado eliminado correctamente");
    } catch (err) {
      console.error("Error eliminando empleado:", err);
      alert("Ocurrió un error al eliminar el empleado");
    }
  };

  const abrirPerfil = () => {
    setTabActivo("perfil");
    setSidebarVisible(false);
  };

  return (
    <div className="admin-container">
      <HeaderAdmin toggleOffcanvas={toggleSidebar} />

      <SidebarAdmin
        visible={sidebarVisible}
        toggleOffcanvas={toggleSidebar}
        setTabActivo={setTabActivo}
        handleAgregarEmpleado={() => setTabActivo("empleados")}
        handleEditarEmpleado={() => setTabActivo("empleados")}
        handleEliminarEmpleado={handleEliminarEmpleadoPorRut} 
        handleAgregarProducto={handleAgregarProducto}
        handleEliminarProducto={handleEliminarProductoPorId}
        abrirPerfil={abrirPerfil}
        logout={logout}
      />

      <main className="px-3 px-md-4 mt-3">
        {tabActivo === "bandeja" && <BandejaContacto />}

        {tabActivo === "empleados" && (
          <SeccionEmpleados
            empleados={empleados}
            setEmpleados={setEmpleados}
            loading={loadingEmpleados}
          />
        )}

        {(tabActivo === "agregarProducto" || tabActivo === "editarProducto") && (
          <ProductoForm
            productoEdit={productoEdit}
            onSave={handleGuardarProducto}
            cancelar={() => setTabActivo("bandeja")}
          />
        )}

        {tabActivo === "productos" && (
          <section className="mt-3">
            <h2 className="h4 mb-3">Listado de productos</h2>
            <div className="card shadow-sm">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Código</th>
                      <th>Nombre</th>
                      <th>Categoría</th>
                      <th>Precio</th>
                      <th>Imagen (URL)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loadingProductos ? (
                      <tr>
                        <td colSpan="5" className="text-center text-muted">
                          Cargando productos...
                        </td>
                      </tr>
                    ) : productos.length > 0 ? (
                      productos.map((p) => (
                        <tr key={p.id}>
                          <td>{p.id}</td>
                          <td>{p.nombre}</td>
                          <td>{p.categoria}</td>
                          <td>${p.precio}</td>
                          <td
                            className="text-truncate"
                            style={{ maxWidth: "250px" }}
                          >
                            {p.imagen}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center text-muted">
                          No hay productos
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {tabActivo === "perfil" && <PerfilAdmin key="perfil" />}

        {tabActivo === "topProductos" && (
          <TopProductos productos={productos} loading={loadingProductos} />
        )}
      </main>
    </div>
  );
}

export default Admin;
