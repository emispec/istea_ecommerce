// Lógica de productos, renderizado de cards, filtros y cuotas

import { abrirModalProducto } from "./modal.js";
import {
  agregarAFavoritos,
  quitarDeFavoritos,
  estaEnFavoritos,
  actualizarBadgeFavoritos,
} from "./favoritos.js";
import {
  agregarAlCarrito,
  actualizarBadgeCarrito,
  renderizarCarritoDesplegable,
} from "./carrito.js";

let productos = [];
let ultimoListado = [];

export function inicializarProductos() {
  fetch("https://fakestoreapi.com/products")
    .then((response) => response.json())
    .then((data) => {
      productos = data;
      renderizarFiltros();
      renderizarProductos(productos);
    });

  document
    .getElementById("filtros-dinamicos")
    .addEventListener("change", filtrarProductos);
  document
    .getElementById("buscador")
    .addEventListener("input", filtrarProductos);
}

function obtenerFiltros(productos) {
  const categorias = [...new Set(productos.map((p) => p.category))];
  return { categorias };
}

function renderizarFiltros() {
  const { categorias } = obtenerFiltros(productos);
  const filtrosDinamicos = document.getElementById("filtros-dinamicos");
  filtrosDinamicos.innerHTML = "";
  const selectCategoria = document.createElement("select");
  selectCategoria.id = "filtro-categoria";
  selectCategoria.innerHTML =
    '<option value="">Todas las categorías</option>' +
    categorias
      .map(
        (cat) =>
          `<option value="${cat}">${
            cat.charAt(0).toUpperCase() + cat.slice(1)
          }</option>`
      )
      .join("");
  filtrosDinamicos.appendChild(selectCategoria);

  let btnEliminar = document.getElementById("eliminar-filtros");
  if (!btnEliminar) {
    btnEliminar = document.createElement("button");
    btnEliminar.id = "eliminar-filtros";
    btnEliminar.type = "button";
    btnEliminar.textContent = "Eliminar filtros";
    btnEliminar.className = "filtros-boton-eliminar";
    filtrosDinamicos.parentElement.appendChild(btnEliminar);
  }
  btnEliminar.onclick = () => {
    selectCategoria.value = "";
    document.getElementById("buscador").value = "";
    filtrarProductos();
    actualizarEstadoBotonEliminar();
  };

  function actualizarEstadoBotonEliminar() {
    const texto = document.getElementById("buscador").value.trim();
    const categoria = selectCategoria.value;
    btnEliminar.disabled = texto === "" && categoria === "";
  }
  document
    .getElementById("buscador")
    .addEventListener("input", actualizarEstadoBotonEliminar);
  selectCategoria.addEventListener("change", actualizarEstadoBotonEliminar);
  actualizarEstadoBotonEliminar();
}

function renderizarProductos(productosMostrados) {
  ultimoListado = productosMostrados;
  const contenedor = document.getElementById("listado-productos");
  contenedor.innerHTML = "";
  if (productosMostrados.length === 0) {
    contenedor.innerHTML =
      '<p style="grid-column: 1/-1; text-align:center; color:#888;">No se encontraron productos.</p>';
    return;
  }
  productosMostrados.forEach((producto) => {
    const card = document.createElement("div");
    card.className = "card-producto";
    card.innerHTML = `
      <div class="card-producto__favorito" data-id="${producto.id}">
        <svg width="22" height="22" fill="${
          estaEnFavoritos(producto.id) ? "red" : "none"
        }" stroke="${
      estaEnFavoritos(producto.id) ? "red" : "#222"
    }" stroke-width="2" viewBox="0 0 24 24"><path d="M12 21s-6-4.35-9-8.5C-1.5 7.5 3.5 3 8.5 7.5c2.5 2.5 3.5 2.5 6 0C20.5 3 25.5 7.5 21 12.5 18 16.65 12 21 12 21z"/></svg>
      </div>
      <div class="card-producto__imagen-contenedor">
        <img src="${producto.image}" alt="${
      producto.title
    }" class="card-producto__imagen" data-id="${producto.id}" />
      </div>
      <div class="card-producto__info">
        <div class="card-producto__nombre">${producto.title}</div>
        <div class="card-producto__precio">$${producto.price}</div>
        <div class="card-producto__cuotas">3 cuotas de $${calcularCuota(
          producto.price,
          3
        )} | 6 cuotas de $${calcularCuota(producto.price, 6)}</div>
        <div class="card-producto__rating">${renderizarEstrellas(
          producto.rating ? producto.rating.rate : 0
        )} <span class="card-producto__rating-num">${
      producto.rating ? producto.rating.rate : "-"
    }</span></div>
      </div>
      <button class="card-producto__boton">
        <svg width="22" height="22" fill="#fff" stroke="#fff" stroke-width="2" viewBox="0 0 24 24"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
        Agregar al carrito
      </button>
    `;
    contenedor.appendChild(card);
  });

  document.querySelectorAll(".card-producto__favorito").forEach((icono) => {
    icono.addEventListener("click", (e) => {
      const id = Number(icono.getAttribute("data-id"));
      if (estaEnFavoritos(id)) {
        quitarDeFavoritos(id);
      } else {
        const producto = productos.find((p) => p.id === id);
        agregarAFavoritos(producto);
      }
      renderizarProductos(ultimoListado);
      actualizarBadgeFavoritos();
    });
  });

  document.querySelectorAll(".card-producto__imagen").forEach((img) => {
    img.addEventListener("click", (e) => {
      const id = Number(img.getAttribute("data-id"));
      const producto = productos.find((p) => p.id === id);
      abrirModalProducto(producto);
    });
  });

  document.querySelectorAll(".card-producto__boton").forEach((btn, idx) => {
    btn.addEventListener("click", () => {
      const id = productosMostrados[idx].id;
      const producto = productos.find((p) => p.id === id);
      agregarAlCarrito(producto);
      actualizarBadgeCarrito();
      // Desplegar el carrito automáticamente y actualizar su contenido
      const iconoCarrito = document.getElementById("carrito");
      cerrarTodosDesplegables();
      iconoCarrito.classList.add("activo");
      document.getElementById("desplegable-carrito").style.display = "block";
      renderizarCarritoDesplegable();
    });
  });
}

function renderizarEstrellas(rating) {
  const estrellas = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      estrellas.push(
        '<svg width="16" height="16" fill="#fbbf24" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>'
      );
    } else if (rating > i - 1 && rating < i) {
      estrellas.push(
        '<svg width="16" height="16" fill="#fbbf24" viewBox="0 0 24 24"><defs><linearGradient id="half"><stop offset="50%" stop-color="#fbbf24"/><stop offset="50%" stop-color="#e5e7eb"/></linearGradient></defs><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill="url(#half)"/></svg>'
      );
    } else {
      estrellas.push(
        '<svg width="16" height="16" fill="#e5e7eb" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>'
      );
    }
  }
  return estrellas.join("");
}

function calcularCuota(precio, cuotas) {
  return (precio / cuotas).toFixed(2);
}

function filtrarProductos() {
  const texto = document.getElementById("buscador").value.toLowerCase();
  const categoria = document.getElementById("filtro-categoria").value;
  let resultado = productos.filter(
    (p) =>
      p.title.toLowerCase().includes(texto) &&
      (categoria === "" || p.category === categoria)
  );
  renderizarProductos(resultado);
}

function cerrarTodosDesplegables() {
  document.getElementById("favoritos").classList.remove("activo");
  document.getElementById("carrito").classList.remove("activo");
  document.getElementById("desplegable-favoritos").style.display = "none";
  document.getElementById("desplegable-carrito").style.display = "none";
}

export { renderizarProductos, productos, ultimoListado };
