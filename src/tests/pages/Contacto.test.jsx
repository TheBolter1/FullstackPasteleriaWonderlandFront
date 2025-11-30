import '@testing-library/jest-dom/vitest';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Contacto from '../../pages/Contacto';

vi.mock('../../components/Navbar', () => ({ default: () => <nav>Navbar</nav> }));
vi.mock('../../components/Footer', () => ({ default: () => <footer>Footer</footer> }));


vi.mock('../../components/AlertaSimple', () => ({
  default: ({ message, msg }) =>
    message || msg ? <div>{message || msg}</div> : null,
}));

vi.mock("../../api/axiosConfig", () => ({
  default: { post: vi.fn(() => Promise.resolve({})) },
}));

const renderContacto = () =>
  render(<MemoryRouter><Contacto /></MemoryRouter>);

describe('Contacto.jsx', () => {
  beforeEach(() => vi.clearAllMocks());

  it('muestra mensaje de éxito al enviar formulario válido', async () => {
    renderContacto();

    fireEvent.change(screen.getByLabelText(/nombre completo/i), {
      target: { value: 'Pedro' },
    });
    fireEvent.change(screen.getByLabelText(/correo/i), {
      target: { value: 'pedro@correo.cl' },
    });
    fireEvent.change(screen.getByLabelText(/mensaje/i), {
      target: { value: 'Hola mundo largo' },
    });

    fireEvent.click(screen.getByRole('button', { name: /enviar/i }));

    expect(await screen.findByText(/mensaje enviado/i)).toBeInTheDocument();
  });
});
