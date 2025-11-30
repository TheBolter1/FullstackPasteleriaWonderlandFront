import { createRef, useState } from "react";
import '../style/style.css';
import AlertaSimple from "../components/AlertaSimple.jsx";
import Navbar from "../components/Navbar";
import Footer from '../components/Footer.jsx';
import axios from "../api/axiosConfig";

document.title = "Contáctanos | Pastelería Wonderland";

function Contacto() {
  const [form, setForm] = useState({ nombre:"", correo:"", orden:"", mensaje:"" });
  const [alert, setAlert] = useState(null);
  const formRef = createRef();
  const [alerta, setAlerta] = useState({ msg: "", type: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleReset = () => {
    setForm({ nombre: "", correo: "", orden: "", mensaje: "" });
    setAlert(null);
    if (formRef.current) {
      formRef.current.reset();
      formRef.current.classList.remove("was-validated"); 
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formEl = formRef.current;
    formEl.classList.add("was-validated");

    let valido = true;

    const inputNombre = formEl.querySelector("#nombre");
    if (!form.nombre.trim()) {
      inputNombre.setCustomValidity("Ingresa tu nombre");
      setAlert("Ingresa tu nombre");
      valido = false;
    } else if (/\d/.test(form.nombre)) {
      inputNombre.setCustomValidity("El nombre no puede contener números");
      setAlert("El nombre no puede contener números");
      valido = false;
    } else {
      inputNombre.setCustomValidity("");
    }

    const inputCorreo = formEl.querySelector("#correo");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.correo)) {
      inputCorreo.setCustomValidity("Correo inválido");
      setAlert("Correo inválido");
      valido = false;
    } else {
      inputCorreo.setCustomValidity("");
    }

    const inputMensaje = formEl.querySelector("#mensaje");
    if (form.mensaje.trim().length < 5) {
      inputMensaje.setCustomValidity("Escribe un mensaje más largo");
      setAlert("Escribe un mensaje más largo");
      valido = false;
    } else {
      inputMensaje.setCustomValidity("");
    }

    if (!valido || !formEl.checkValidity()) {
      return;
    }

    try {
      await axios.post("/api/mensajes", {
        nombre: form.nombre,
        correo: form.correo,
        orden: form.orden || "-",
        mensaje: form.mensaje,
      });

      setAlerta({
        msg: "¡Mensaje enviado! Te responderemos pronto.",
        type: "success",
      });
      setAlert(null);

      setForm({ nombre: "", correo: "", orden: "", mensaje: "" });
      formEl.reset();
      formEl.classList.remove("was-validated");
    } catch (err) {
      console.error("Error enviando mensaje:", err);
      setAlerta({
        msg: "Ocurrió un problema al enviar tu mensaje. Inténtalo nuevamente más tarde.",
        type: "danger",
      });
    }
  };

  return (
    <>
      <Navbar />
      <AlertaSimple
        message={alerta.msg}
        type={alerta.type}
        onClose={() => setAlerta({ msg: "", type: "" })}
      />
      <main>
        <div id="banner-contacto">
          <img
            src="/assets/img/Banner/contactanos.webp"
            alt="Pastelería Wonderland"
            className="banner"
          />
          <p id="letra-b-contacto">Contáctanos</p>
        </div>

        <section className="container my-4" id="contacto-card">
          <div className="row justify-content-center">
            <div className="col-12 col-md-10 col-lg-8">
              <div className="card contacto-card border-0">
                <div className="card-body p-4 p-md-5">
                  <h2 className="section-title text-center mb-2">Hablemos</h2>
                  <span className="title-underline mx-auto d-block mb-3"></span>
                  <p className="text-center soft-muted mb-4">
                    Canal de contacto para <strong>pedidos grandes</strong>,{" "}
                    <strong>ventas corporativas</strong> y{" "}
                    <strong>soporte de pedidos</strong>. Déjanos tus datos y te
                    responderemos a la brevedad.
                  </p>

                  {alert && (
                    <div className="custom-alert success">
                      {alert}
                    </div>
                  )}

                  <form
                    id="form-contacto"
                    noValidate
                    onSubmit={handleSubmit}
                    ref={formRef}
                  >
                    <div className="mb-3">
                      <label htmlFor="nombre" className="form-label">
                        Nombre completo
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="nombre"
                        name="nombre"
                        placeholder="Tu nombre"
                        value={form.nombre}
                        onChange={handleChange}
                        required
                      />
                      <div className="invalid-feedback">
                        Ingresa tu nombre.
                      </div>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="correo" className="form-label">
                        Correo electrónico
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        id="correo"
                        name="correo"
                        placeholder="ejemplo@correo.cl"
                        value={form.correo}
                        onChange={handleChange}
                        required
                      />
                      <div className="invalid-feedback">
                        Ingresa un correo válido.
                      </div>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="orden" className="form-label">
                        Número de orden{" "}
                        <span className="soft-muted">(opcional)</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="orden"
                        name="orden"
                        placeholder="Si tu mensaje es por un pedido, incluye el número (ej. #12345)"
                        value={form.orden}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="mensaje" className="form-label">
                        Mensaje
                      </label>
                      <textarea
                        className="form-control"
                        id="mensaje"
                        name="mensaje"
                        rows={5}
                        placeholder="Cuéntanos en qué podemos ayudarte."
                        value={form.mensaje}
                        onChange={handleChange}
                        required
                      ></textarea>
                      <div className="invalid-feedback">
                        Escribe un mensaje.
                      </div>
                    </div>

                    <div className="d-grid gap-2 d-sm-flex justify-content-sm-end">
                      <button
                        type="reset"
                        className="btn btn-light btn-sm"
                        onClick={handleReset}
                      >
                        Limpiar
                      </button>
                      <button
                        type="submit"
                        className="btn btn-success btn-sm"
                      >
                        Enviar
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default Contacto;
