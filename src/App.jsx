import "./style/style.css";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import React, { Suspense, lazy } from "react";

import PrivateRoute from "./components/PrivateRoute.jsx";
import AdminRoute from "./components/AdminRoute.jsx";
import Login from "./pages/Login.jsx";
import Admin from "./pages/Admin.jsx";
import Carro from "./pages/Carro.jsx";
import ListaProductos from "./components/ListaProductos.jsx";
import CrearProducto from "./components/CrearProductos.jsx";

const Home = lazy(() => import("./pages/Home.jsx"));
const Productos = lazy(() => import("./pages/Productos.jsx"));
const Contacto = lazy(() => import("./pages/Contacto.jsx"));
const DetalleProducto = lazy(() => import("./pages/DetalleProducto.jsx"));



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
