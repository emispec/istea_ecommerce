// Inicialización global y eventos principales
import { inicializarProductos } from "./productos.js";
import { inicializarCarrito } from "./carrito.js";
import { inicializarFavoritos } from "./favoritos.js";
import { inicializarModal } from "./modal.js";

document.addEventListener("DOMContentLoaded", () => {
  inicializarProductos();
  inicializarCarrito();
  inicializarFavoritos();
  inicializarModal();
});
