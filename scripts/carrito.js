// Lógica del carrito, renderizado, persistencia y badge en el icono

let carrito = JSON.parse(localStorage.getItem("carrito") || "[]");

export function inicializarCarrito() {
  actualizarBadgeCarrito();
  const icono = document.querySelector("#carrito .icono-boton");
  icono.addEventListener("click", (e) => {
    e.stopPropagation();
    const contenedor = document.getElementById("carrito");
    if (contenedor.classList.contains("activo")) {
      contenedor.classList.remove("activo");
      document.getElementById("desplegable-carrito").style.display = "none";
    } else {
      cerrarTodosDesplegables();
      contenedor.classList.add("activo");
      renderizarCarritoDesplegable();
      document.getElementById("desplegable-carrito").style.display = "block";
    }
  });
  document.getElementById("desplegable-carrito").style.display = "none";
}

function cerrarTodosDesplegables() {
  document.getElementById("favoritos").classList.remove("activo");
  document.getElementById("carrito").classList.remove("activo");
  document.getElementById("desplegable-favoritos").style.display = "none";
  document.getElementById("desplegable-carrito").style.display = "none";
}

export function agregarAlCarrito(producto) {
  const idx = carrito.findIndex((p) => p.id === producto.id);
  if (idx !== -1) {
    carrito[idx].cantidad += 1;
  } else {
    carrito.push({ ...producto, cantidad: 1 });
  }
  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarBadgeCarrito();
}

function quitarDelCarrito(id) {
  carrito = carrito.filter((p) => p.id !== id);
  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarBadgeCarrito();
  renderizarCarritoDesplegable();
}

function modificarCantidadCarrito(id, delta) {
  const idx = carrito.findIndex((p) => p.id === id);
  if (idx !== -1) {
    carrito[idx].cantidad += delta;
    if (carrito[idx].cantidad < 1) carrito[idx].cantidad = 1;
    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarBadgeCarrito();
    renderizarCarritoDesplegable();
    document.getElementById("desplegable-carrito").style.display = "block";
  }
}

function vaciarCarrito() {
  carrito = [];
  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarBadgeCarrito();
  renderizarCarritoDesplegable();
}

function totalCarrito() {
  return carrito.reduce((acc, p) => acc + p.price * p.cantidad, 0);
}

export function actualizarBadgeCarrito() {
  const icono = document.querySelector("#carrito .icono-boton svg");
  const badge = obtenerBadge("#carrito");
  const cantidad = carrito.reduce((acc, p) => acc + p.cantidad, 0);
  if (cantidad > 0) {
    icono.style.stroke = "#2563eb";
    icono.style.fill = "#2563eb";
    badge.textContent = cantidad;
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

export function renderizarCarritoDesplegable() {
  const contenedor = document.getElementById("desplegable-carrito");
  contenedor.innerHTML = "";
  if (carrito.length === 0) {
    contenedor.innerHTML +=
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
        <button class="carrito-item__menos" data-id="${producto.id}" ${
      producto.cantidad === 1 ? "disabled" : ""
    }>-</button>
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
  btnVaciar.addEventListener("click", () => {
    vaciarCarrito();
  });
  btnComprar.addEventListener("click", () => {
    vaciarCarrito();
    contenedor.innerHTML =
      '<div class="carrito-mensaje-compra">¡Gracias por tu compra! Tu pedido fue procesado correctamente.</div>';
  });
}
