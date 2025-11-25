import axios from "axios";


const productosMock = [
  { id: 1, nombre: "Torta de Chocolate", precio: 6000, imagen: "", categoria: "sin lactosa" },
  { id: 2, nombre: "Cupcake Vainilla", precio: 2500, imagen: "", categoria: "cupcake" },
];


const BASE_URL = "http://localhost:8080/api/producto";

export const getProductos = () => axios.get(BASE_URL);

export const crearProducto = (producto) => axios.post(BASE_URL, producto);

export const borrarProducto = (id) => axios.delete(`${BASE_URL}/${id}`);

export const actualizarProducto = (producto) => axios.put(`${BASE_URL}/${producto.id}`, producto);

