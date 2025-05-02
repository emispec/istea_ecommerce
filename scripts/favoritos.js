// Lógica de favoritos, renderizado, persistencia y badge en el icono

import { agregarAlCarrito, actualizarBadgeCarrito } from "./carrito.js";

let favoritos = JSON.parse(localStorage.getItem("favoritos") || "[]");

export function inicializarFavoritos() {
  actualizarBadgeFavoritos();
  const icono = document.querySelector("#favoritos .icono-boton");
  icono.addEventListener("click", (e) => {
    e.stopPropagation();
    const contenedor = document.getElementById("favoritos");
    if (contenedor.classList.contains("activo")) {
      contenedor.classList.remove("activo");
      document.getElementById("desplegable-favoritos").style.display = "none";
    } else {
      cerrarTodosDesplegables();
      contenedor.classList.add("activo");
      renderizarFavoritosDesplegable();
      document.getElementById("desplegable-favoritos").style.display = "block";
    }
  });
  document.getElementById("desplegable-favoritos").style.display = "none";
}

function cerrarTodosDesplegables() {
  document.getElementById("favoritos").classList.remove("activo");
  document.getElementById("carrito").classList.remove("activo");
  document.getElementById("desplegable-favoritos").style.display = "none";
  document.getElementById("desplegable-carrito").style.display = "none";
}

export function agregarAFavoritos(producto) {
  if (!favoritos.some((f) => f.id === producto.id)) {
    favoritos.push(producto);
    localStorage.setItem("favoritos", JSON.stringify(favoritos));
    actualizarBadgeFavoritos();
  }
}

export function quitarDeFavoritos(id) {
  favoritos = favoritos.filter((f) => f.id !== id);
  localStorage.setItem("favoritos", JSON.stringify(favoritos));
  actualizarBadgeFavoritos();
}

export function estaEnFavoritos(id) {
  return favoritos.some((f) => f.id === id);
}

export function actualizarBadgeFavoritos() {
  const icono = document.querySelector("#favoritos .icono-boton svg");
  const badge = obtenerBadge("#favoritos");
  if (favoritos.length > 0) {
    icono.style.stroke = "red";
    icono.style.fill = "red";
    badge.textContent = favoritos.length;
    badge.style.display = "flex";
  } else {
    icono.style.stroke = "#222";
    icono.style.fill = "none";
    badge.style.display = "none";
  }
}

function obtenerBadge(selector) {
  let badge = document.querySelector(`${selector} .icono-badge`);
  if (!badge) {
    badge = document.createElement("span");
    badge.className = "icono-badge";
    document.querySelector(`${selector} .icono-boton`).appendChild(badge);
  }
  return badge;
}

function renderizarFavoritosDesplegable() {
  const contenedor = document.getElementById("desplegable-favoritos");
  contenedor.innerHTML = "";
  if (favoritos.length === 0) {
    contenedor.innerHTML +=
      '<p style="color:#888; text-align:center;">No hay favoritos.</p>';
    return;
  }
  favoritos.forEach((producto) => {
    const item = document.createElement("div");
    item.className = "favorito-item";
    item.innerHTML = `
      <img src="${producto.image}" alt="${producto.title}" class="favorito-item__img" />
      <span class="favorito-item__titulo">${producto.title}</span>
      <button class="favorito-item__quitar" data-id="${producto.id}">&times;</button>
    `;
    contenedor.appendChild(item);
  });
  const btnAgregarTodos = document.createElement("button");
  btnAgregarTodos.className = "favorito-item__agregar-todos";
  btnAgregarTodos.textContent = "Agregar todos al carrito";
  contenedor.appendChild(btnAgregarTodos);

  contenedor.querySelectorAll(".favorito-item__quitar").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = Number(btn.getAttribute("data-id"));
      quitarDeFavoritos(id);
      renderizarFavoritosDesplegable();
    });
  });
  btnAgregarTodos.addEventListener("click", () => {
    favoritos.forEach((producto) => {
      agregarAlCarrito(producto);
    });
    favoritos = [];
    localStorage.setItem("favoritos", JSON.stringify(favoritos));
    actualizarBadgeFavoritos();
    renderizarFavoritosDesplegable();
    actualizarBadgeCarrito();
  });
}
