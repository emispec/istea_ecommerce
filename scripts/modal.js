// Lógica del modal de producto, centrado y control de apertura/cierre

let modal;

export function inicializarModal() {}

export function abrirModalProducto(producto) {
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "modal-producto";
    document.body.appendChild(modal);
  }
  modal.innerHTML = `
    <div class="modal-producto__fondo"></div>
    <div class="modal-producto__contenido modal-producto__centrado">
      <button class="modal-producto__cerrar">&times;</button>
      <img src="${producto.image}" alt="${
    producto.title
  }" class="modal-producto__imagen" />
      <h2 class="modal-producto__titulo">${producto.title}</h2>
      <div class="modal-producto__categoria">Categoría: ${
        producto.category
      }</div>
      <div class="modal-producto__precio">Precio: $${producto.price}</div>
      <div class="modal-producto__rating">${renderizarEstrellas(
        producto.rating ? producto.rating.rate : 0
      )} <span>${producto.rating ? producto.rating.rate : "-"}</span></div>
      <p class="modal-producto__descripcion">${producto.description}</p>
    </div>
  `;
  modal.style.display = "flex";
  modal.querySelector(".modal-producto__cerrar").onclick = cerrarModalProducto;
  modal.querySelector(".modal-producto__fondo").onclick = cerrarModalProducto;
}

function cerrarModalProducto() {
  if (modal) modal.style.display = "none";
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
