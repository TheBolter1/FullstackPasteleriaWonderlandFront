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
    fetch("/personal.json")
      .then((res) => res.json())
      .then((data) => setEmpleados(data))
      .catch((err) => {
        console.error("Error cargando empleados:", err);
        setEmpleados([]);
      })
      .finally(() => setLoadingEmpleados(false));
  }, []);
  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const res = await axios.get("/api/producto");
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
        handleAgregarProducto={handleAgregarProducto}
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

        {tabActivo === "perfil" && <PerfilAdmin key="perfil" />}

        {tabActivo === "topProductos" && (
          <TopProductos productos={productos} loading={loadingProductos} />
        )}
      </main>
    </div>
  );
}

export default Admin;
