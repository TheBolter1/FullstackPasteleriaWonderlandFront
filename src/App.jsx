import "./style/style.css";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import React, { Suspense, lazy } from "react";

import PrivateRoute from "./components/PrivateRoute.jsx";
import AdminRoute from "./components/AdminRoute.jsx";

const Home = lazy(() => import("./pages/Home.jsx"));
const Productos = lazy(() => import("./pages/Productos.jsx"));
const Contacto = lazy(() => import("./pages/Contacto.jsx"));
const Carro = lazy(() => import("./pages/Carro.jsx"));
const DetalleProducto = lazy(() => import("./pages/DetalleProducto.jsx"));
const Login = lazy(() => import("./pages/Login.jsx"));
const Admin = lazy(() => import("./pages/Admin.jsx"));
const ListaProductos = lazy(() => import("./components/ListaProductos.jsx"));
const CrearProducto = lazy(() => import("./components/CrearProductos.jsx"));

function App() {
  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: "100vh" }}
          >
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
          </div>
        }
      >
        <Routes>
  
          <Route path="/" element={<Navigate to="/home" />} />

          {/* Rutas públicas */}
          <Route path="/home" element={<Home />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/inicio-sesion" element={<Login />} />

          <Route path="/producto/:id" element={<DetalleProducto />} />

          <Route
            path="/carro-de-compras"
            element={
              <PrivateRoute>
                <Carro />
              </PrivateRoute>
            }
          />

  

  
          <Route
            path="/administracion"
            element={
              <AdminRoute>
                <Admin />
              </AdminRoute>
            }
          />
          <Route
            path="/lista-productos"
            element={
              <AdminRoute>
                <ListaProductos />
              </AdminRoute>
            }
          />
          <Route
            path="/crear-producto"
            element={
              <AdminRoute>
                <CrearProducto />
              </AdminRoute>
            }
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
