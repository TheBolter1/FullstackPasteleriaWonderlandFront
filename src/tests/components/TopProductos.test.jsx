import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import TopProductos from "../../components/TopProductos";

vi.mock("axios", () => ({
  default: {
    get: vi.fn(() =>
      Promise.resolve({
        data: Array.from({ length: 12 }, (_, i) => ({
          id: i + 1,
          nombre: `Producto ${i + 1}`,
          imagen: `/img${i + 1}.jpg`,
        })),
      })
    ),
  },
}));

describe("TopProductos Component", () => {
  it("renderiza los top 10 productos", async () => {
    render(<TopProductos />);

    for (let i = 0; i < 10; i++) {
      expect(await screen.findByText(`Producto ${i + 1}`)).toBeInTheDocument();
      expect(screen.getByText(`#${i + 1}`)).toBeInTheDocument();
    }
  });

  it("muestra mensaje cuando la API viene vacía", async () => {
    const axios = (await import("axios")).default;
    axios.get.mockResolvedValueOnce({ data: [] });

    render(<TopProductos />);

    expect(await screen.findByText(/no hay productos disponibles/i)).toBeInTheDocument();
  });
});
