// Archivo principal de scripts

const iconosDesplegables = document.querySelectorAll(".icono-desplegable");

iconosDesplegables.forEach((icono) => {
  const boton = icono.querySelector(".icono-boton");
  boton.addEventListener("click", function (evento) {
    evento.stopPropagation();
    cerrarTodosDesplegables();
    icono.classList.toggle("activo");
  });
});

function cerrarTodosDesplegables() {
  iconosDesplegables.forEach((icono) => {
    icono.classList.remove("activo");
  });
}

document.addEventListener("click", function () {
  cerrarTodosDesplegables();
});

// Favoritos en localStorage
function obtenerFavoritos() {
  return JSON.parse(localStorage.getItem("favoritos") || "[]");
}
function guardarFavoritos(favoritos) {
  localStorage.setItem("favoritos", JSON.stringify(favoritos));
}
function estaEnFavoritos(id) {
  return obtenerFavoritos().some((fav) => fav.id === id);
}
function actualizarIconoNavbarFavoritos() {
  const icono = document.querySelector("#favoritos .icono-boton svg");
  if (obtenerFavoritos().length > 0) {
    icono.style.stroke = "red";
    icono.style.fill = "red";
  } else {
    icono.style.stroke = "#222";
    icono.style.fill = "none";
  }
}

function renderizarFavoritosDesplegable() {
  const contenedor = document.getElementById("desplegable-favoritos");
  const favoritos = obtenerFavoritos();
  contenedor.innerHTML = "";
  if (favoritos.length === 0) {
    contenedor.innerHTML =
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
      let favs = obtenerFavoritos();
      favs = favs.filter((f) => f.id !== id);
      guardarFavoritos(favs);
      renderizarFavoritosDesplegable();
      actualizarIconoNavbarFavoritos();
      renderizarProductos(ultimoListado);
    });
  });
  btnAgregarTodos.addEventListener("click", () => {
    guardarFavoritos([]);
    renderizarFavoritosDesplegable();
    actualizarIconoNavbarFavoritos();
    renderizarProductos(ultimoListado);
  });
}

document
  .querySelector("#favoritos .icono-boton")
  .addEventListener("click", () => {
    renderizarFavoritosDesplegable();
  });

// Carrito en localStorage
function obtenerCarrito() {
  return JSON.parse(localStorage.getItem("carrito") || "[]");
}
function guardarCarrito(carrito) {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}
function agregarAlCarrito(producto) {
  let carrito = obtenerCarrito();
  const idx = carrito.findIndex((p) => p.id === producto.id);
  if (idx !== -1) {
    carrito[idx].cantidad += 1;
  } else {
    carrito.push({ ...producto, cantidad: 1 });
  }
  guardarCarrito(carrito);
  renderizarCarritoDesplegable();
}
function quitarDelCarrito(id) {
  let carrito = obtenerCarrito();
  carrito = carrito.filter((p) => p.id !== id);
  guardarCarrito(carrito);
  renderizarCarritoDesplegable();
}
function modificarCantidadCarrito(id, delta) {
  let carrito = obtenerCarrito();
  const idx = carrito.findIndex((p) => p.id === id);
  if (idx !== -1) {
    carrito[idx].cantidad += delta;
    if (carrito[idx].cantidad < 1) carrito[idx].cantidad = 1;
    guardarCarrito(carrito);
    renderizarCarritoDesplegable();
  }
}
function vaciarCarrito() {
  guardarCarrito([]);
  renderizarCarritoDesplegable();
}
function totalCarrito() {
  return obtenerCarrito().reduce((acc, p) => acc + p.price * p.cantidad, 0);
}

function renderizarCarritoDesplegable() {
  const contenedor = document.getElementById("desplegable-carrito");
  const carrito = obtenerCarrito();
  contenedor.innerHTML = "";
  if (carrito.length === 0) {
    contenedor.innerHTML =
      '<p style="color:#888; text-align:center;">El carrito está vacío.</p>';
    return;
  }
  carrito.forEach((producto) => {
    const item = document.createElement("div");
    item.className = "carrito-item";
    item.innerHTML = `
      <img src="${producto.image}" alt="${
      producto.title
    }" class="carrito-item__img" />
      <span class="carrito-item__titulo">${producto.title}</span>
      <div class="carrito-item__controles">
        <button class="carrito-item__menos" data-id="${producto.id}">-</button>
        <span class="carrito-item__cantidad">${producto.cantidad}</span>
        <button class="carrito-item__mas" data-id="${producto.id}">+</button>
      </div>
      <span class="carrito-item__precio">$${(
        producto.price * producto.cantidad
      ).toFixed(2)}</span>
      <button class="carrito-item__quitar" data-id="${
        producto.id
      }">&times;</button>
    `;
    contenedor.appendChild(item);
  });
  const total = document.createElement("div");
  total.className = "carrito-total";
  total.innerHTML = `<span>Total:</span><span>$${totalCarrito().toFixed(
    2
  )}</span>`;
  contenedor.appendChild(total);

  const btnComprar = document.createElement("button");
  btnComprar.className = "carrito-boton-comprar";
  btnComprar.textContent = "Proceder con la compra";
  contenedor.appendChild(btnComprar);

  const btnVaciar = document.createElement("button");
  btnVaciar.className = "carrito-boton-vaciar";
  btnVaciar.textContent = "Eliminar todo el carrito";
  contenedor.appendChild(btnVaciar);

  contenedor.querySelectorAll(".carrito-item__mas").forEach((btn) => {
    btn.addEventListener("click", () => {
      modificarCantidadCarrito(Number(btn.getAttribute("data-id")), 1);
    });
  });
  contenedor.querySelectorAll(".carrito-item__menos").forEach((btn) => {
    btn.addEventListener("click", () => {
      modificarCantidadCarrito(Number(btn.getAttribute("data-id")), -1);
    });
  });
  contenedor.querySelectorAll(".carrito-item__quitar").forEach((btn) => {
    btn.addEventListener("click", () => {
      quitarDelCarrito(Number(btn.getAttribute("data-id")));
    });
  });
  btnVaciar.addEventListener("click", vaciarCarrito);
  btnComprar.addEventListener("click", () => {
    alert("¡Gracias por tu compra! (Funcionalidad demo)");
    vaciarCarrito();
  });
}

document
  .querySelector("#carrito .icono-boton")
  .addEventListener("click", () => {
    renderizarCarritoDesplegable();
  });

// Fetch de productos y renderizado
let productos = [];
let ultimoListado = [];

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
      <div class="card-producto__nombre">${producto.title}</div>
      <div class="card-producto__precio">$${producto.price}</div>
      <div class="card-producto__rating">${renderizarEstrellas(
        producto.rating ? producto.rating.rate : 0
      )} <span class="card-producto__rating-num">${
      producto.rating ? producto.rating.rate : "-"
    }</span></div>
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
      let favs = obtenerFavoritos();
      const producto = productos.find((p) => p.id === id);
      if (estaEnFavoritos(id)) {
        favs = favs.filter((f) => f.id !== id);
      } else {
        favs.push(producto);
      }
      guardarFavoritos(favs);
      renderizarProductos(ultimoListado);
      actualizarIconoNavbarFavoritos();
      renderizarFavoritosDesplegable();
    });
  });
  document.querySelectorAll(".card-producto__imagen").forEach((img) => {
    img.addEventListener("click", (e) => {
      const id = Number(img.getAttribute("data-id"));
      const producto = productos.find((p) => p.id === id);
      abrirModalProducto(producto);
    });
  });
  agregarEventosBotonesCarrito();
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

// Modal de producto
function abrirModalProducto(producto) {
  let modal = document.getElementById("modal-producto");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "modal-producto";
    document.body.appendChild(modal);
  }
  modal.innerHTML = `
    <div class="modal-producto__fondo"></div>
    <div class="modal-producto__contenido">
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
  modal.style.display = "block";
  modal.querySelector(".modal-producto__cerrar").onclick = cerrarModalProducto;
  modal.querySelector(".modal-producto__fondo").onclick = cerrarModalProducto;
}
function cerrarModalProducto() {
  const modal = document.getElementById("modal-producto");
  if (modal) modal.style.display = "none";
}

function agregarEventosBotonesCarrito() {
  document.querySelectorAll(".card-producto__boton").forEach((btn, idx) => {
    btn.addEventListener("click", () => {
      const id = ultimoListado[idx].id;
      const producto = productos.find((p) => p.id === id);
      agregarAlCarrito(producto);
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  fetch("https://fakestoreapi.com/products")
    .then((response) => response.json())
    .then((data) => {
      productos = data;
      renderizarFiltros();
      renderizarProductos(productos);
    });

  document
    .getElementById("formulario-busqueda")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      filtrarProductos();
    });
  document
    .getElementById("buscador")
    .addEventListener("input", filtrarProductos);
  document
    .getElementById("filtros-dinamicos")
    .addEventListener("change", filtrarProductos);
  actualizarIconoNavbarFavoritos();
});
