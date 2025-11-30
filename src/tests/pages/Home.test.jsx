import '@testing-library/jest-dom/vitest';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from "axios";


afterEach(() => cleanup());


vi.mock('bootstrap', () => ({ Carousel: vi.fn() }));


vi.mock('axios', () => ({
  default: {
    get: vi.fn(() =>
      Promise.resolve({
        data: [
          { id: "TC001", nombre: "Torta Cuadrada de Chocolate", ventas: 120, precio: 45000, imagen: "img1.jpg" },
          { id: "TC002", nombre: "Torta Cuadrada de Frutas", ventas: 80, precio: 50000, imagen: "img2.jpg" },
          { id: "TT001", nombre: "Torta Circular de Vainilla", ventas: 450, precio: 40000, imagen: "img3.jpg" },
          { id: "TT002", nombre: "Torta Circular de Manjar", ventas: 95, precio: 42000, imagen: "img4.jpg" },
        ]
      })
    ),
  },
}));


vi.mock('../../components/ProductCard', () => ({
  default: ({ producto }) => (
    <a href={`/producto/${producto.id}`} role="link">
      Ver producto
    </a>
  ),
}));

import Home from '../../pages/Home';

const renderHome = () =>
  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  );

describe('Home.jsx', () => {
  beforeEach(() => vi.clearAllMocks());

  it('muestra encabezado, carrusel y Noticia', () => {
    renderHome();

    expect(screen.getByRole('heading', { name: /productos de la semana/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /slide 1/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /técnica internacional/i })).toBeInTheDocument();
  });

  it('muestra los 4 productos top por ventas', async () => {
    renderHome();

    const links = await screen.findAllByRole('link', { name: /ver producto/i });
    expect(links).toHaveLength(4);

    expect(screen.getByText(/torta circular de vainilla/i)).toBeInTheDocument();
    expect(screen.getByText(/torta cuadrada de chocolate/i)).toBeInTheDocument();
    expect(screen.getByText(/torta circular de manjar/i)).toBeInTheDocument();
    expect(screen.getByText(/torta cuadrada de frutas/i)).toBeInTheDocument();
  });

  it('los CTAs enlazan a /productos', () => {
    renderHome();

    expect(screen.getByRole('link', { name: /revisa nuestra carta/i })).toHaveAttribute('href', '/productos');
    expect(screen.getByRole('link', { name: /conoce nuestras tortas artesanales/i })).toHaveAttribute('href', '/productos');
  });
});


describe('Home.jsx – catálogo vacío', () => {
  it('muestra "Cargando productos..." cuando no hay datos', async () => {
    vi.doMock('axios', () => ({
      default: { get: vi.fn(() => Promise.resolve({ data: [] })) }
    }));

    const { default: HomeReloaded } = await import('../../pages/Home');

    render(
      <MemoryRouter>
        <HomeReloaded />
      </MemoryRouter>
    );

    expect(screen.getByText(/cargando productos/i)).toBeInTheDocument();
  });
});
