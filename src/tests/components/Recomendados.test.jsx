import '@testing-library/jest-dom';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Recomendados from '../../components/Recomendados';

afterEach(() => cleanup());

// Mock axios
vi.mock("axios", () => ({
  default: {
    get: vi.fn(() =>
      Promise.resolve({
        data: [
          { id: "TC001", nombre: "Torta 1", imagen: "/1.jpg" },
          { id: "TC002", nombre: "Torta 2", imagen: "/2.jpg" },
          { id: "TC003", nombre: "Torta 3", imagen: "/3.jpg" },
        ],
      })
    ),
  },
}));

describe('Recomendados.jsx', () => {
  it('renderiza correctamente los productos recomendados', async () => {
    render(
      <MemoryRouter>
        <Recomendados productoId="TC001" />
      </MemoryRouter>
    );

    expect(
      await screen.findByText(/también te puede gustar/i)
    ).toBeInTheDocument();

    expect(screen.getAllByRole("img").length).toBeGreaterThan(0);
  });

  it('no renderiza nada si el API viene vacío', async () => {
    const axios = (await import("axios")).default;
    axios.get.mockResolvedValueOnce({ data: [] });

    const { container } = render(
      <MemoryRouter>
        <Recomendados />
      </MemoryRouter>
    );

    expect(container.firstChild).toBeNull();
  });

  it('los links funcionan correctamente', async () => {
    render(
      <MemoryRouter>
        <Recomendados />
      </MemoryRouter>
    );

    const links = await screen.findAllByRole("link");

    expect(links[0].getAttribute("href")).toMatch("/producto/");
  });
});
