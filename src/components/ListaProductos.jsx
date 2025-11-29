import React, { useEffect, useState } from "react";
import axios from "axios";

const ListaProductos = () => {
  const [productos, setProductos] = useState([]);
  const [productoEditando, setProductoEditando] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:9090/api/producto")
      .then(res => setProductos(res.data))
      .catch(err => console.error("Error cargando productos:", err));
  }, []);

  const handleBorrar = (idProducto) => {
    axios.delete(`http://localhost:9090/api/producto/${idProducto}`)
      .then(() => setProductos(productos.filter(p => p.idProducto !== idProducto)))
      .catch(err => console.error("Error al eliminar producto:", err));
  };

  const handleGuardar = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:9090/api/producto/${productoEditando.idProducto}`, productoEditando)
      .then(res => {
        setProductos(productos.map(p => p.idProducto === res.data.idProducto ? res.data : p));
        setProductoEditando(null);
      })
      .catch(err => console.error("Error al actualizar producto:", err));
  };

  return (
    <div>
      <h2>Productos</h2>
      <ul>
        {productos.map(p => (
          <li key={p.idProducto}>
            <p>{p.nombreProducto} - ${p.precio}</p>
            <p>Categoría: {p.categoria}</p>
            <p>{p.descripcion}</p>
            {p.imagen && <img src={p.imagen} alt={p.nombreProducto} width="100" />}
            <button onClick={() => handleBorrar(p.idProducto)}>Eliminar</button>
            <button onClick={() => setProductoEditando(p)}>Editar</button>
          </li>
        ))}
      </ul>

      {productoEditando && (
        <form onSubmit={handleGuardar}>
          <input
            value={productoEditando.nombreProducto}
            onChange={e => setProductoEditando({ ...productoEditando, nombreProducto: e.target.value })}
            required
          />
          <input
            type="number"
            value={productoEditando.precio}
            onChange={e => setProductoEditando({ ...productoEditando, precio: Number(e.target.value) })}
            required
          />
          <input
            type="text"
            value={productoEditando.categoria}
            onChange={e => setProductoEditando({ ...productoEditando, categoria: e.target.value })}
            required
          />
          <input
            type="text"
            value={productoEditando.imagen || ""}
            onChange={e => setProductoEditando({ ...productoEditando, imagen: e.target.value })}
          />
          <textarea
            value={productoEditando.descripcion || ""}
            onChange={e => setProductoEditando({ ...productoEditando, descripcion: e.target.value })}
          />
          <button type="submit">Guardar</button>
          <button type="button" onClick={() => setProductoEditando(null)}>Cancelar</button>
        </form>
      )}
    </div>
  );
};

export default ListaProductos;
