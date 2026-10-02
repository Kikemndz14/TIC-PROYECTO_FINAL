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

function guardarCarrito() {
    try { localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito)); } catch (e) { /* sin almacenamiento */ }
}

function cargarCarrito() {
    try { carrito = JSON.parse(localStorage.getItem(CLAVE_CARRITO)) || []; } catch (e) { carrito = []; }
}

function abrirCarrito() {
    panel?.classList.add("abierto");
    overlay?.classList.add("activo");
}
window.abrirCarrito = abrirCarrito;

function cerrarCarrito() {
    panel?.classList.remove("abierto");
    overlay?.classList.remove("activo");
}

document.getElementById("btn-abrir-carrito")?.addEventListener("click", abrirCarrito);
document.getElementById("btn-cerrar-carrito")?.addEventListener("click", cerrarCarrito);
overlay?.addEventListener("click", cerrarCarrito);
document.addEventListener("keydown", e => { if (e.key === "Escape") cerrarCarrito(); });

// Un mismo producto en tallas distintas cuenta como ítems separados
function claveItem(id, talla) {
    return id + "-" + (talla || "unica");
}

function agregarAlCarrito(id, talla) {
    const producto = window.PRODUCTOS.find(p => p.id === id);
    if (!producto) return;

    const clave = claveItem(id, talla);
    const existente = carrito.find(item => item.clave === clave);
    if (existente) {
        existente.cantidad++;
    } else {
        carrito.push({
            clave, id: producto.id, nombre: producto.nombre, talla: talla || null,
            precio: producto.precio, emoji: producto.emoji, color: producto.color,
            foto: producto.imagenes && producto.imagenes[0] ? producto.imagenes[0] : "", cantidad: 1
        });
    }
    actualizarCarrito();
    window.mostrarAviso(`${producto.nombre} agregado al carrito`);
}
window.agregarAlCarrito = agregarAlCarrito;

function cambiarCantidad(clave, cambio) {
    const item = carrito.find(i => i.clave === clave);
    if (!item) return;
    item.cantidad += cambio;
    if (item.cantidad <= 0) quitarDelCarrito(clave);
    else actualizarCarrito();
}

function quitarDelCarrito(clave) {
    carrito = carrito.filter(i => i.clave !== clave);
    actualizarCarrito();
}

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
                <div class="item-miniatura" style="background:${window.fondoSuave(item.color)}" aria-hidden="true">
                    <span>${item.emoji}</span>
                    ${item.foto ? `<img src="${item.foto}" alt="" onerror="this.remove()">` : ""}
                </div>
                <div class="item-detalle">
                    <h4>${item.nombre}</h4>
                    ${item.talla ? `<p class="item-precio">Talla: ${item.talla}</p>` : ""}
                    <p class="item-precio">${window.formatoQuetzales(item.precio)}</p>
                    <div class="control-cantidad">
                        <button data-accion="menos" data-clave="${item.clave}" aria-label="Quitar uno">&minus;</button>
                        <span>${item.cantidad}</span>
                        <button data-accion="mas" data-clave="${item.clave}" aria-label="Agregar uno">+</button>
                    </div>
                </div>
                <button class="btn-quitar" data-accion="quitar" data-clave="${item.clave}">Quitar</button>
            </div>
        `).join("");
    }
    guardarCarrito();
}

listaCarrito?.addEventListener("click", e => {
    const boton = e.target.closest("button[data-accion]");
    if (!boton) return;
    const clave = boton.dataset.clave;
    if (boton.dataset.accion === "mas") cambiarCantidad(clave, 1);
    if (boton.dataset.accion === "menos") cambiarCantidad(clave, -1);
    if (boton.dataset.accion === "quitar") quitarDelCarrito(clave);
});

// Pedido por WhatsApp (incluye la talla)
botonCheckout?.addEventListener("click", () => {
    if (carrito.length === 0) return;
    const lineas = carrito.map(i =>
        `• ${i.cantidad} x ${i.nombre}${i.talla ? " (talla " + i.talla + ")" : ""} - ${window.formatoQuetzales(i.precio * i.cantidad)}`);
    const total = carrito.reduce((suma, i) => suma + i.precio * i.cantidad, 0);
    const mensaje = `Hola, quiero hacer este pedido en Mega Paca Shop:\n${lineas.join("\n")}\nTotal: ${window.formatoQuetzales(total)}`;
    window.open(`https://wa.me/${WHATSAPP_TIENDA}?text=${encodeURIComponent(mensaje)}`, "_blank", "noopener");
});

cargarCarrito();
actualizarCarrito();