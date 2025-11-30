import React from "react";
import "@testing-library/jest-dom/vitest";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

vi.mock("../../components/Navbar", () => ({ default: () => <nav>Navbar</nav> }));
vi.mock("../../components/Footer", () => ({ default: () => <footer>Footer</footer> }));
vi.mock("../../components/AlertaSimple", () => ({
  default: ({ message }) => (message ? <div>{message}</div> : null),
}));
vi.mock("../../components/Recomendados", () => ({
  default: () => <div>Recomendados</div>,
}));

// Mock axios
vi.mock("axios", () => ({
  default: {
    get: vi.fn(),
  },
}));

import DetalleProducto from "../../pages/DetalleProducto";

const mockProducto = {
  idProducto: "TC001",
  nombreProducto: "Torta Cuadrada de Chocolate",
  precio: 45000,
  descripcion: "Deliciosa torta de chocolate",
  imagen: "/test.jpg",
};

const renderDetalle = (id = "TC001") =>
  render(
    <MemoryRouter initialEntries={[`/detalle/${id}`]}>
      <Routes>
        <Route path="/detalle/:id" element={<DetalleProducto />} />
        <Route path="/productos" element={<div>Página Productos</div>} />
      </Routes>
    </MemoryRouter>
  );

describe("DetalleProducto.jsx", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
  });


  it("muestra 'Cargando producto...' durante loading", async () => {
    const axios = (await import("axios")).default;
    axios.get.mockImplementation(() => new Promise(() => {})); 

    renderDetalle("TC001");

    expect(screen.getByText(/cargando producto/i)).toBeInTheDocument();
  });

  it("muestra error si el producto no existe", async () => {
    const axios = (await import("axios")).default;
    axios.get.mockRejectedValueOnce(new Error("No existe"));

    renderDetalle("TC001");

    expect(await screen.findByText(/no pudimos cargar/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /volver a productos/i })).toBeInTheDocument();
  });

  it("renderiza correctamente el producto", async () => {
    const axios = (await import("axios")).default;
    axios.get.mockResolvedValueOnce({ data: mockProducto });

    renderDetalle("TC001");

    expect(await screen.findByRole("heading", { name: /torta cuadrada/i })).toBeInTheDocument();
    expect(screen.getByText(/\$45\.000/)).toBeInTheDocument();
    expect(screen.getByText(/deliciosa torta/i)).toBeInTheDocument();
    expect(screen.getByRole("img")).toHaveAttribute("src", "/test.jpg");
  });


  it("aumenta y disminuye la cantidad", async () => {
    const axios = (await import("axios")).default;
    axios.get.mockResolvedValueOnce({ data: mockProducto });

    renderDetalle();

    const increase = await screen.findByRole("button", { name: "+" });
    const decrease = screen.getByRole("button", { name: "−" });
    const input = screen.getByDisplayValue("1");

    fireEvent.click(increase);
    expect(input.value).toBe("2");

    fireEvent.click(decrease);
    expect(input.value).toBe("1");
  });

  it("muestra alerta al intentar superar el límite (8)", async () => {
    const axios = (await import("axios")).default;
    axios.get.mockResolvedValueOnce({ data: mockProducto });

    renderDetalle();

    const increase = await screen.findByRole("button", { name: "+" });

    for (let i = 0; i < 8; i++) fireEvent.click(increase);

    expect(await screen.findByText(/cantidad máxima/i)).toBeInTheDocument();
  });

  it("agrega correctamente al carrito", async () => {
    const axios = (await import("axios")).default;
    axios.get.mockResolvedValueOnce({ data: mockProducto });

    Storage.prototype.setItem = vi.fn();

    renderDetalle();

    const button = await screen.findByRole("button", { name: /añadir al carrito/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(Storage.prototype.setItem).toHaveBeenCalled();
    });

    expect(await screen.findByText(/agregado al carrito/i)).toBeInTheDocument();
  });
});
