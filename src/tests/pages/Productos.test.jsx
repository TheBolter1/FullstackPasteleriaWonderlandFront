import '@testing-library/jest-dom/vitest';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';

// MOCK AXIOS
vi.mock('axios', () => ({
  default: {
    get: vi.fn(() =>
      Promise.resolve({
        data: [
          { id: "TC001", nombre: "Torta Cuadrada de Chocolate", precio: 45000, categoria: "Tortas Cuadradas" },
          { id: "TC002", nombre: "Torta Cuadrada de Frutas", precio: 50000, categoria: "Tortas Cuadradas" },
          { id: "TT001", nombre: "Torta Circular de Vainilla", precio: 40000, categoria: "Tortas Circulares" },
        ],
      })
    ),
  },
}));

// MOCK ProductCard
vi.mock('../../components/ProductCard', () => ({
  default: ({ producto, onAddToCart }) => (
    <div>
      <p>{producto.nombre}</p>
      <button onClick={() => onAddToCart(producto)}>Agregar</button>
    </div>
  ),
}));

import Productos from '../../pages/Productos';

afterEach(() => cleanup());

const renderProductos = (url = '/productos') =>
  render(
    <MemoryRouter initialEntries={[url]}>
      <Productos />
    </MemoryRouter>
  );


beforeEach(() => {
  Object.defineProperty(window, "sessionStorage", {
    value: {
      store: {},
      getItem: vi.fn((k) => window.sessionStorage.store[k] || null),
      setItem: vi.fn((k, v) => (window.sessionStorage.store[k] = v)),
      removeItem: vi.fn((k) => delete window.sessionStorage.store[k]),
      clear: vi.fn(() => (window.sessionStorage.store = {})),
    },
    writable: true,
  });

  vi.clearAllMocks();
});

describe('Productos.jsx', () => {
  it('muestra "Cargando productos..." mientras carga', () => {
    axios.get.mockReturnValueOnce(new Promise(() => {})); 
    renderProductos();

    expect(screen.getByText(/cargando productos/i)).toBeInTheDocument();
  });

  it('filtra productos correctamente por categoría', async () => {
    renderProductos('/productos?categoria=Tortas Cuadradas');

    const lista = await screen.findAllByText(/torta cuadrada/i);
    expect(lista).toHaveLength(2);

    expect(screen.queryByText(/torta circular/i)).not.toBeInTheDocument();
  });

  it('abre modal y agrega producto correctamente', async () => {
    renderProductos();

    const botones = await screen.findAllByRole('button', { name: /agregar/i });
    fireEvent.click(botones[0]);

    expect(await screen.findByText(/Selecciona la cantidad/i)).toBeInTheDocument();

    const confirmarBtn = screen.getByRole('button', { name: /confirmar/i });
    fireEvent.click(confirmarBtn);

    expect(sessionStorage.setItem).toHaveBeenCalled();
  });
});
