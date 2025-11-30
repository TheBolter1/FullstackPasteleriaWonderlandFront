import { vi } from "vitest";



vi.mock("axios", () => {
  const mockAxios = {
    get: vi.fn(() => Promise.resolve({ data: [] })),
    post: vi.fn(() => Promise.resolve({ data: {} })),
    put: vi.fn(() => Promise.resolve({ data: {} })),
    delete: vi.fn(() => Promise.resolve({})),

    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() }
    },


    create: vi.fn(() => ({
      get: vi.fn(() => Promise.resolve({ data: [] })),
      post: vi.fn(() => Promise.resolve({ data: {} })),
      put: vi.fn(() => Promise.resolve({ data: {} })),
      delete: vi.fn(() => Promise.resolve({})),

      interceptors: {
        request: { use: vi.fn() },
        response: { use: vi.fn() }
      }
    }))
  };

  return { default: mockAxios };
});

const mockMensaje = [
  {
    fecha: "17/10/2025",
    nombre: "Cliente de prueba",
    correo: "cliente@test.com",
    orden: "ORD123",
    mensaje: "Mensaje de prueba"
  }
];

vi.stubGlobal("fetch", vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve(mockMensaje)
  })
));

window.scrollTo = vi.fn();
window.alert = vi.fn();
