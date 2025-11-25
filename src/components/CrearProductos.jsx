import React, { useState } from "react";
import axios from "axios";

const CrearProducto = () => {
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [categoria, setCategoria] = useState("");
  const [imagen, setImagen] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const nuevoProducto = {
      nombre,
      precio: Number(precio),
      categoria,
      imagen
    };

    axios.post("http://localhost:8080/api/producto", nuevoProducto)
      .then(response => {
        console.log("Producto creado:", response.data);
        // Limpiar formulario
        setNombre("");
        setPrecio("");
        setCategoria("");
        setImagen("");
      })
      .catch(error => console.error("Error al crear producto:", error));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
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
      <button type="submit">Crear Producto</button>
    </form>
  );
};

export default CrearProducto;
