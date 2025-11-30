import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import HeaderAdmin from "../components/HeaderAdmin";
import SidebarAdmin from "../components/SidebarAdmin";
import BandejaContacto from "../components/BandejaContacto";
import ProductoForm from "../components/ProductoForm";
import SeccionEmpleados from "../components/SeccionEmpleados";
import PerfilAdmin from "../components/PerfilAdmin";
import TopProductos from "../components/TopProductos";

function Admin() {
  const [mensajes, setMensajes] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [productos, setProductos] = useState(
    () => JSON.parse(localStorage.getItem("catalogoProductos")) || []
  );

  const [tabActivo, setTabActivo] = useState("bandeja");
  const [productoEdit, setProductoEdit] = useState(null);
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const navigate = useNavigate();


  useEffect(() => {
    fetch("/mensajes.json")
      .then(res => res.json())
      .then(data => setMensajes(data))
      .catch(err => console.error("Error cargando mensajes:", err));

    fetch("/personal.json")
      .then(res => res.json())
      .then(data => setEmpleados(data))
      .catch(err => console.error("Error cargando empleados:", err));
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

  
  const handleGuardarProducto = (producto) => {
    const nuevosProductos = productoEdit
      ? productos.map(p => (p.id === producto.id ? producto : p))
      : [...productos, producto];

    setProductos(nuevosProductos);
    setProductoEdit(null);
    setTabActivo("bandeja");
    localStorage.setItem("catalogoProductos", JSON.stringify(nuevosProductos));
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
        {tabActivo === "bandeja" && <BandejaContacto mensajes={mensajes} />}

        {tabActivo === "empleados" && (
          <SeccionEmpleados empleados={empleados} setEmpleados={setEmpleados} />
        )}

        {(tabActivo === "agregarProducto" || tabActivo === "editarProducto") && (
          <ProductoForm
            productoEdit={productoEdit}
            handleGuardarProducto={handleGuardarProducto}
            cancelar={() => setTabActivo("bandeja")}
          />
        )}

        {tabActivo === "perfil" && <PerfilAdmin key="perfil" />}

        {tabActivo === "topProductos" && <TopProductos />}
      </main>
    </div>
  );
}

export default Admin;
