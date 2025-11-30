import React, { useState } from "react";

function ProductoForm({ productoEdit, onSave, cancelar }) {
  const CATEGORIAS = [
    "Tortas Cuadradas",
    "Tortas Circulares",
    "Postres Individuales",
    "Productos Sin Azúcar",
    "Pastelería Tradicional",
    "Productos Sin Gluten",
    "Productos Veganos",
    "Tortas Especiales",
  ];

  const [codigo, setCodigo] = useState(productoEdit?.id || "");
  const [nombre, setNombre] = useState(productoEdit?.nombre || "");
  const [precio, setPrecio] = useState(productoEdit?.precio || "");
  const [categoria, setCategoria] = useState(
    productoEdit?.categoria || "Tortas Cuadradas"
  );
  const [imagenUrl, setImagenUrl] = useState(productoEdit?.imagen || "");
  const [imagenArchivo, setImagenArchivo] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    const producto = {
      id: codigo,
      nombre,
      precio: Number(precio),
      categoria,
      imagen: imagenUrl,
    };

    onSave(producto, imagenArchivo);
  };

  return (
    <section className="card shadow-sm p-3 mt-3">
      <h5>{productoEdit ? "Editar Producto" : "Agregar Producto"}</h5>

      <form onSubmit={handleSubmit} data-testid="form-producto">
        <div className="row g-2">
          <div className="col-md-3">
            <label className="form-label">Código</label>
            <input
              type="text"
              className="form-control"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              required
              disabled={!!productoEdit}
            />
          </div>

          <div className="col-md-5">
            <label htmlFor="nombre" className="form-label">
              Nombre
            </label>
            <input
              id="nombre"
              name="nombre"
              type="text"
              className="form-control"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>

          <div className="col-md-4">
            <label htmlFor="precio" className="form-label">
              Precio
            </label>
            <input
              id="precio"
              name="precio"
              type="number"
              className="form-control"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="row g-2 mt-2">
          <div className="col-md-6">
            <label htmlFor="categoria" className="form-label">
              Categoría
            </label>
            <select
              id="categoria"
              name="categoria"
              className="form-select"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              required
            >
              {CATEGORIAS.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-6">
            <label htmlFor="imagen_url" className="form-label">
              Imagen (URL)
            </label>
            <input
              id="imagen_url"
              name="imagen_url"
              type="text"
              className="form-control"
              value={imagenUrl}
              onChange={(e) => setImagenUrl(e.target.value)}
            />
          </div>
        </div>

        <div className="row g-2 mt-2">
          <div className="col-md-12">
            <label htmlFor="imagen_archivo" className="form-label">
              Imagen (Archivo)
            </label>
            <input
              id="imagen_archivo"
              name="imagen_archivo"
              type="file"
              className="form-control"
              onChange={(e) => setImagenArchivo(e.target.files[0])}
            />
          </div>
        </div>

        <div className="mt-3 d-flex justify-content-end">
          <button
            type="button"
            className="btn btn-outline-secondary me-2"
            data-testid="btn-cancelar"
            onClick={cancelar}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            data-testid="btn-guardar"
          >
            Guardar
          </button>
        </div>
      </form>
    </section>
  );
}

export default ProductoForm;
