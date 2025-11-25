// src/tests/components/NoticiaHome.test.jsx
import '@testing-library/jest-dom/vitest';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import NoticiaHome from '../../components/NoticiaHome';

afterEach(() => cleanup());

beforeEach(() => {
  vi.clearAllMocks();
  global.fetch = vi.fn();
});

const renderNoticiaHome = () =>
  render(
    <MemoryRouter>
      <NoticiaHome />
    </MemoryRouter>
  );

describe('NoticiaHome.jsx', () => {
  it('muestra mensaje de carga inicialmente', () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ articles: [] }),
    });

    renderNoticiaHome();
    expect(screen.getByText(/cargando dulces noticias/i)).toBeInTheDocument();
  });

  it('renderiza noticias correctamente cuando la API responde', async () => {
    const MOCK_NEWS = [
      { title: 'Noticia 1', description: 'Descripción 1', url: '#', urlToImage: '/img1.jpg' },
      { title: 'Noticia 2', description: 'Descripción 2', url: '#', urlToImage: '/img2.jpg' },
      { title: 'Noticia 3', description: 'Descripción 3', url: '#', urlToImage: '/img3.jpg' },
    ];

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ articles: MOCK_NEWS }),
    });

    renderNoticiaHome();

    await waitFor(() =>
      expect(screen.getByText(/noticias del mundo de la pastelería/i)).toBeInTheDocument()
    );

    expect(screen.getByText('Noticia 1')).toBeInTheDocument();
    expect(screen.getByText('Noticia 2')).toBeInTheDocument();
    expect(screen.getByText('Noticia 3')).toBeInTheDocument();
  });

  it('muestra mensaje de error si la API falla', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
    });

    renderNoticiaHome();

    await waitFor(() =>
      expect(screen.getByText(/no hay noticias disponibles/i)).toBeInTheDocument()
    );
  });
});
