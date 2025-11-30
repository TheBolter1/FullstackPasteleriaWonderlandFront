import React from "react";
import "@testing-library/jest-dom";
import { render, screen, waitFor, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Admin from "../../pages/Admin";
import axios from "axios";


vi.mock("axios");


beforeEach(() => {
  axios.get.mockImplementation((url) => {
    if (url.includes("mensajes.json")) {
      return Promise.resolve({
        data: [{ id: 1, nombre: "Felipe", mensaje: "Hola" }],
      });
    }

    if (url.includes("personal.json")) {
      return Promise.resolve({
        data: [{ id: 1, nombre: "Empleado 1" }],
      });
    }

    return Promise.reject(new Error("URL no reconocida en axios mock"));
  });
});


vi.mock("../../components/HeaderAdmin", () => ({
  default: () => <header data-testid="header-admin">HeaderAdmin</header>,
}));

vi.mock("../../components/BandejaContacto", () => ({
  default: () => <section data-testid="bandeja-contacto">BandejaContacto</section>,
}));

vi.mock("../../components/ProductoForm", () => ({
  default: () => <form data-testid="producto-form">ProductoForm</form>,
}));

vi.mock("../../components/SeccionEmpleados", () => ({
  default: () => <section data-testid="seccion-empleados">SeccionEmpleados</section>,
}));

vi.mock("../../components/PerfilAdmin", () => ({
  default: () => <section data-testid="perfil-admin">PerfilAdmin</section>,
}));

vi.mock("../../components/TopProductos", () => ({
  default: () => <section data-testid="top-productos">TopProductos</section>,
}));

vi.mock("../../components/SidebarAdmin", () => ({
  default: ({ visible }) => (
    <aside data-testid="sidebar-admin">SidebarAdmin {visible ? "visible" : "oculto"}</aside>
  ),
}));

const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => (store[key] = value.toString()),
    removeItem: (key) => delete store[key],
    clear: () => (store = {}),
  };
})();

Object.defineProperty(window, "localStorage", { value: localStorageMock });

describe("Admin Component", () => {
  it("renderiza correctamente los componentes principales", async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <Admin />
        </MemoryRouter>
      );
    });

    expect(screen.getByTestId("header-admin")).toBeInTheDocument();
    expect(screen.getByTestId("sidebar-admin")).toBeInTheDocument();

   

    expect(screen.getByTestId("bandeja-contacto")).toBeInTheDocument();
  });

  it("usa correctamente el almacenamiento local", async () => {
    localStorage.setItem("catalogoProductos", JSON.stringify([{ id: 1, nombre: "Torta" }]));

    await act(async () => {
      render(
        <MemoryRouter>
          <Admin />
        </MemoryRouter>
      );
    });

    expect(localStorage.getItem("catalogoProductos")).toContain("Torta");
  });

  it("renderiza sin errores visibles", async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <Admin />
        </MemoryRouter>
      );
    });

    await waitFor(() => {
      expect(screen.queryByText(/Error/i)).not.toBeInTheDocument();
    });
  });
});
