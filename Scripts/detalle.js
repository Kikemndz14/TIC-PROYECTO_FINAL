// ===== MEGA PACA SHOP: ventana emergente de producto =====

const modal = document.getElementById("modal-producto");
const detalleContenido = document.getElementById("detalle-contenido");

let productoActual = null;
let fotos = [];
let fotoActiva = 0;
let tallaElegida = null;

// Devuelve solo las fotos que existen en la carpeta imagenes/
function cargarFotosValidas(rutas) {
    return Promise.all(rutas.map(ruta => new Promise(resolver => {
        const img = new Image();
        img.onload = () => resolver(ruta);
        img.onerror = () => resolver(null);
        img.src = ruta;
    }))).then(lista => lista.filter(Boolean));
}

async function abrirDetalle(id) {
    if (!modal || !detalleContenido) {
        window.mostrarAviso("Falta la ventana de producto en index.html: usa el index.html nuevo");
        return;
    }
    const producto = window.PRODUCTOS.find(p => p.id === id);
    if (!producto) return;

    productoActual = producto;
    tallaElegida = null;
    fotoActiva = 0;
    fotos = [];

    pintarDetalle();
    pintarGaleria();
    modal.classList.add("abierto");
    document.body.classList.add("sin-scroll");

    fotos = await cargarFotosValidas(producto.imagenes || []);
    if (productoActual === producto) pintarGaleria();
}
window.abrirDetalle = abrirDetalle;

function cerrarDetalle() {
    if (!modal) return;
    modal.classList.remove("abierto");
    document.body.classList.remove("sin-scroll");
}

function pintarGaleria() {
    const p = productoActual;
    const galeria = document.getElementById("detalle-galeria");

    if (fotos.length === 0) {
        galeria.className = "detalle-galeria una";
        galeria.innerHTML = `
            <div class="imagen-principal" style="background:${window.fondoSuave(p.color)}">
                <div class="placeholder-foto"><span>${p.emoji}</span><small>Foto pendiente</small></div>
            </div>`;
        return;
    }

    const varias = fotos.length > 1;
    galeria.className = "detalle-galeria" + (varias ? "" : " una");
    galeria.innerHTML = `
        ${varias ? `<div class="miniaturas">${fotos.map((f, i) =>
            `<img src="${f}" alt="Foto ${i + 1}" data-foto="${i}" class="${i === fotoActiva ? "activa" : ""}">`).join("")}</div>` : ""}
        <div class="imagen-principal">
            <img src="${fotos[fotoActiva]}" alt="${p.nombre}">
            ${varias ? `<button class="flecha izq" data-flecha="-1" aria-label="Foto anterior">&lsaquo;</button>
                        <button class="flecha der" data-flecha="1" aria-label="Foto siguiente">&rsaquo;</button>` : ""}
        </div>`;
}

function pintarDetalle() {
    const p = productoActual;
    const codigo = "MP-" + String(p.id).padStart(4, "0");
    const descuento = p.precioAnterior ? Math.round((1 - p.precio / p.precioAnterior) * 100) : 0;
    const tieneTallas = p.tallas && p.tallas.length > 0;

    detalleContenido.innerHTML = `
        <div class="detalle-galeria" id="detalle-galeria"></div>
        <div class="detalle-info">
            <h2 id="detalle-titulo">${p.nombre}</h2>
            <p class="detalle-codigo">Código: ${codigo}</p>

            <div class="detalle-precio">
                <span class="precio-actual">${window.formatoQuetzales(p.precio)}</span>
                ${p.precioAnterior ? `<span class="precio-anterior">${window.formatoQuetzales(p.precioAnterior)}</span><span class="etiqueta-descuento">-${descuento}%</span>` : ""}
            </div>
            <div class="franja-envio"><i class="fa-solid fa-truck"></i> Envío a toda Guatemala</div>

            <div class="bloque-talla">
                <p class="titulo-bloque">${tieneTallas ? 'Talla: <strong id="talla-elegida">elige una</strong>' : "Talla: <strong>Única</strong>"}</p>
                ${tieneTallas ? `<div class="lista-tallas">${p.tallas.map(t => `<button class="opcion-talla" data-talla="${t}">${t}</button>`).join("")}</div>` : ""}
                ${p.categoria === "ropa" ? `
                <details class="guia-tallas">
                    <summary>Guía de tallas</summary>
                    <table>
                        <tr><th>Talla</th><th>Pecho (cm)</th></tr>
                        <tr><td>XS</td><td>80 - 84</td></tr>
                        <tr><td>S</td><td>85 - 89</td></tr>
                        <tr><td>M</td><td>90 - 94</td></tr>
                        <tr><td>L</td><td>95 - 99</td></tr>
                        <tr><td>XL</td><td>100 - 104</td></tr>
                    </table>
                    <small>Medidas aproximadas.</small>
                </details>` : ""}
            </div>

            <p class="titulo-bloque">Tipo de envío</p>
            <span class="chip-envio">Nacional</span>

            <div class="fila-acciones">
                <button class="btn-anadir" id="btn-anadir">AÑADIR AL CARRITO</button>
                <button class="btn-favorito" id="btn-favorito" aria-label="Guardar en favoritos"><i class="fa-regular fa-heart"></i></button>
            </div>

            <ul class="lista-garantias">
                <li><i class="fa-solid fa-truck"></i> Entrega en 2 a 5 días hábiles</li>
                <li><i class="fa-solid fa-rotate-left"></i> Cambios dentro de 7 días</li>
                <li><i class="fa-solid fa-shield-halved"></i> Compra segura por WhatsApp</li>
            </ul>

            <p class="titulo-bloque">Descripción</p>
            <p class="detalle-descripcion">${p.descripcion || ""}</p>
        </div>`;
}

// --- Eventos ---
detalleContenido?.addEventListener("click", e => {
    const miniatura = e.target.closest("[data-foto]");
    if (miniatura) { fotoActiva = Number(miniatura.dataset.foto); pintarGaleria(); return; }

    const flecha = e.target.closest("[data-flecha]");
    if (flecha) {
        fotoActiva = (fotoActiva + Number(flecha.dataset.flecha) + fotos.length) % fotos.length;
        pintarGaleria();
        return;
    }

    const talla = e.target.closest(".opcion-talla");
    if (talla) {
        tallaElegida = talla.dataset.talla;
        detalleContenido.querySelectorAll(".opcion-talla").forEach(b => b.classList.toggle("activa", b === talla));
        document.getElementById("talla-elegida").textContent = tallaElegida;
        return;
    }

    if (e.target.closest("#btn-favorito")) {
        const boton = e.target.closest("#btn-favorito");
        boton.classList.toggle("activo");
        boton.querySelector("i").className = boton.classList.contains("activo") ? "fa-solid fa-heart" : "fa-regular fa-heart";
        return;
    }

    if (e.target.closest("#btn-anadir")) {
        const necesitaTalla = productoActual.tallas && productoActual.tallas.length > 0;
        if (necesitaTalla && !tallaElegida) {
            window.mostrarAviso("Elige tu talla antes de añadir");
            return;
        }
        if (typeof window.agregarAlCarrito !== "function") {
            window.mostrarAviso("Falta el archivo scripts/carrito.js");
            return;
        }
        window.agregarAlCarrito(productoActual.id, tallaElegida);
        cerrarDetalle();
        window.abrirCarrito();
    }
});

document.getElementById("btn-cerrar-detalle")?.addEventListener("click", cerrarDetalle);
modal?.addEventListener("click", e => { if (e.target === modal) cerrarDetalle(); });
document.addEventListener("keydown", e => {
    if (!modal || !modal.classList.contains("abierto")) return;
    if (e.key === "Escape") cerrarDetalle();
    if (fotos.length > 1 && (e.key === "ArrowLeft" || e.key === "ArrowRight")) {
        fotoActiva = (fotoActiva + (e.key === "ArrowRight" ? 1 : -1) + fotos.length) % fotos.length;
        pintarGaleria();
    }
});