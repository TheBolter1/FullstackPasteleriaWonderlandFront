import React, { useState } from "react";
import axios from "axios";

const CrearProducto = () => {
  const [nombreProducto, setNombreProducto] = useState("");
  const [precio, setPrecio] = useState("");
  const [categoria, setCategoria] = useState("");
  const [imagen, setImagen] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const nuevoProducto = {
      nombreProducto,
      precio: Number(precio),
      categoria,
      imagen,
      descripcion
    };

    axios.post("http://localhost:9090/api/producto", nuevoProducto)
      .then(response => {
        console.log("Producto creado:", response.data);
        setNombreProducto("");
        setPrecio("");
        setCategoria("");
        setImagen("");
        setDescripcion("");
      })
      .catch(error => console.error("Error al crear producto:", error));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Nombre"
        value={nombreProducto}
        onChange={(e) => setNombreProducto(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Precio"
        value={precio}
        onChange={(e) => setPrecio(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Categoría"
        value={categoria}
        onChange={(e) => setCategoria(e.target.value)}
      />
      <input
        type="text"
        placeholder="Imagen URL"
        value={imagen}
        onChange={(e) => setImagen(e.target.value)}
      />
      <textarea
        placeholder="Descripción"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
      />
      <button type="submit">Crear Producto</button>
    </form>
  );
};

export default CrearProducto;
