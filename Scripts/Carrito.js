// ===== MEGA PACA SHOP: carrito de compras =====

// Cambia este número por el WhatsApp real de la tienda (código de país + número)
const WHATSAPP_TIENDA = "50200000000";
const CLAVE_CARRITO = "megapaca_carrito";

let carrito = [];

const panel = document.getElementById("panel-carrito");
const overlay = document.getElementById("overlay-carrito");
const listaCarrito = document.getElementById("lista-carrito");
const contadorHeader = document.getElementById("contador-carrito");
const contadorPanel = document.getElementById("cantidad-items-carrito");
const precioSubtotal = document.getElementById("precio-subtotal");
const botonCheckout = document.getElementById("btn-checkout");

// --- Guardado local ---
function guardarCarrito() {
    try { localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito)); } catch (e) { /* sin almacenamiento */ }
}

function cargarCarrito() {
    try { carrito = JSON.parse(localStorage.getItem(CLAVE_CARRITO)) || []; } catch (e) { carrito = []; }
}

// --- Abrir y cerrar panel ---
function abrirCarrito() {
    panel.classList.add("abierto");
    overlay.classList.add("activo");
}

function cerrarCarrito() {
    panel.classList.remove("abierto");
    overlay.classList.remove("activo");
}

document.getElementById("btn-abrir-carrito").addEventListener("click", abrirCarrito);
document.getElementById("btn-cerrar-carrito").addEventListener("click", cerrarCarrito);
overlay.addEventListener("click", cerrarCarrito);
document.addEventListener("keydown", e => { if (e.key === "Escape") cerrarCarrito(); });

// --- Operaciones ---
function agregarAlCarrito(id) {
    const producto = window.PRODUCTOS.find(p => p.id === id);
    if (!producto) return;

    const existente = carrito.find(item => item.id === id);
    if (existente) {
        existente.cantidad++;
    } else {
        carrito.push({ id: producto.id, nombre: producto.nombre, precio: producto.precio, emoji: producto.emoji, color: producto.color, cantidad: 1 });
    }
    actualizarCarrito();
    window.mostrarAviso(`${producto.nombre} agregado al carrito`);
}

function cambiarCantidad(id, cambio) {
    const item = carrito.find(i => i.id === id);
    if (!item) return;
    item.cantidad += cambio;
    if (item.cantidad <= 0) quitarDelCarrito(id);
    else actualizarCarrito();
}

function quitarDelCarrito(id) {
    carrito = carrito.filter(i => i.id !== id);
    actualizarCarrito();
}

// --- Pintar el carrito ---
function actualizarCarrito() {
    const totalItems = carrito.reduce((suma, i) => suma + i.cantidad, 0);
    const subtotal = carrito.reduce((suma, i) => suma + i.precio * i.cantidad, 0);

    contadorHeader.textContent = totalItems;
    contadorPanel.textContent = totalItems;
    precioSubtotal.textContent = window.formatoQuetzales(subtotal);
    botonCheckout.disabled = carrito.length === 0;

    if (carrito.length === 0) {
        listaCarrito.innerHTML = '<p class="carrito-vacio">Tu carrito está vacío. Agrega algo de la paca.</p>';
    } else {
        listaCarrito.innerHTML = carrito.map(item => `
            <div class="item-carrito">
                <div class="item-miniatura" style="background:${window.fondoSuave(item.color)}" aria-hidden="true">${item.emoji}</div>
                <div class="item-detalle">
                    <h4>${item.nombre}</h4>
                    <p class="item-precio">${window.formatoQuetzales(item.precio)}</p>
                    <div class="control-cantidad">
                        <button data-accion="menos" data-id="${item.id}" aria-label="Quitar uno">&minus;</button>
                        <span>${item.cantidad}</span>
                        <button data-accion="mas" data-id="${item.id}" aria-label="Agregar uno">+</button>
                    </div>
                </div>
                <button class="btn-quitar" data-accion="quitar" data-id="${item.id}">Quitar</button>
            </div>
        `).join("");
    }
    guardarCarrito();
}

// --- Eventos por delegación ---
// Botones "Agregar" de las tarjetas
document.getElementById("contenedor-productos").addEventListener("click", e => {
    const boton = e.target.closest(".btn-agregar");
    if (boton) agregarAlCarrito(Number(boton.dataset.id));
});

// Botones dentro del panel
listaCarrito.addEventListener("click", e => {
    const boton = e.target.closest("button[data-accion]");
    if (!boton) return;
    const id = Number(boton.dataset.id);
    if (boton.dataset.accion === "mas") cambiarCantidad(id, 1);
    if (boton.dataset.accion === "menos") cambiarCantidad(id, -1);
    if (boton.dataset.accion === "quitar") quitarDelCarrito(id);
});

// --- Pedido por WhatsApp ---
botonCheckout.addEventListener("click", () => {
    if (carrito.length === 0) return;
    const lineas = carrito.map(i => `• ${i.cantidad} x ${i.nombre} (${window.formatoQuetzales(i.precio * i.cantidad)})`);
    const total = carrito.reduce((suma, i) => suma + i.precio * i.cantidad, 0);
    const mensaje = `Hola, quiero hacer este pedido en Mega Paca Shop:\n${lineas.join("\n")}\nTotal: ${window.formatoQuetzales(total)}`;
    window.open(`https://wa.me/${WHATSAPP_TIENDA}?text=${encodeURIComponent(mensaje)}`, "_blank", "noopener");
});

cargarCarrito();
actualizarCarrito();