// ===== MEGA PACA SHOP: lógica principal =====

window.PRODUCTOS = typeof PRODUCTOS_DATA !== "undefined" ? PRODUCTOS_DATA : [];
const faltaProductos = typeof PRODUCTOS_DATA === "undefined";
let categoriaActual = "todos";
let textoBusqueda = "";

const contenedor = document.getElementById("contenedor-productos");

function formatoQuetzales(valor) {
    return "Q" + Number(valor).toFixed(2);
}
window.formatoQuetzales = formatoQuetzales;

// Fondo suave a partir del color del producto
window.fondoSuave = function (color) {
    return color + "26";
};

function mostrarProductos() {
    if (faltaProductos) {
        contenedor.innerHTML = '<p class="sin-resultados">No se cargaron los productos. Revisa que exista datos/productos.js y que index.html lo incluya antes de principal.js.</p>';
        return;
    }
    const texto = textoBusqueda.trim().toLowerCase();
    const lista = window.PRODUCTOS.filter(p =>
        (categoriaActual === "todos" || p.categoria === categoriaActual) &&
        p.nombre.toLowerCase().includes(texto)
    );

    if (lista.length === 0) {
        contenedor.innerHTML = '<p class="sin-resultados">No encontramos productos con ese filtro. Prueba con otra búsqueda.</p>';
        return;
    }

    // La foto principal se pone encima del emoji; si el archivo no existe, se quita y queda el emoji
    contenedor.innerHTML = lista.map(p => `
        <article class="tarjeta-producto" data-id="${p.id}">
            <div class="tarjeta-imagen" style="background:${window.fondoSuave(p.color)}">
                <span class="emoji" aria-hidden="true">${p.emoji}</span>
                ${p.imagenes && p.imagenes[0] ? `<img class="foto-tarjeta" src="${p.imagenes[0]}" alt="${p.nombre}" onerror="this.remove()">` : ""}
                ${p.etiqueta ? `<span class="etiqueta-producto">${p.etiqueta}</span>` : ""}
            </div>
            <div class="tarjeta-info">
                <h3>${p.nombre}</h3>
                <p class="tarjeta-categoria">${p.categoria}</p>
                <p class="tarjeta-precio">${formatoQuetzales(p.precio)}</p>
                <button class="btn-agregar" data-id="${p.id}">VER PRODUCTO</button>
            </div>
        </article>
    `).join("");
}

// Al tocar una tarjeta se abre la ventana emergente (detalle.js)
contenedor.addEventListener("click", e => {
    const tarjeta = e.target.closest(".tarjeta-producto");
    if (!tarjeta) return;
    if (typeof window.abrirDetalle !== "function") {
        window.mostrarAviso("Falta el archivo scripts/detalle.js");
        return;
    }
    window.abrirDetalle(Number(tarjeta.dataset.id));
});

function cambiarCategoria(categoria) {
    categoriaActual = categoria;
    document.querySelectorAll(".btn-filtro").forEach(btn => {
        btn.classList.toggle("activo", btn.dataset.filtro === categoria);
    });
    mostrarProductos();
}

document.querySelectorAll(".btn-filtro").forEach(btn => {
    btn.addEventListener("click", () => cambiarCategoria(btn.dataset.filtro));
});

const menu = document.getElementById("menu-navegacion");
menu?.querySelectorAll("a[data-categoria]").forEach(enlace => {
    enlace.addEventListener("click", () => {
        cambiarCategoria(enlace.dataset.categoria);
        menu?.classList.remove("abierto");
    });
});

document.getElementById("btn-menu-movil")?.addEventListener("click", () => {
    menu?.classList.toggle("abierto");
});

// Búsqueda
const barraBusqueda = document.getElementById("barra-busqueda");
const inputBusqueda = document.getElementById("input-busqueda");
document.getElementById("btn-buscar")?.addEventListener("click", () => {
    barraBusqueda?.classList.toggle("abierta");
    if (barraBusqueda?.classList.contains("abierta")) inputBusqueda?.focus();
});
inputBusqueda?.addEventListener("input", () => {
    textoBusqueda = inputBusqueda.value;
    mostrarProductos();
    if (textoBusqueda) document.getElementById("productos").scrollIntoView();
});

// Aviso breve (lo usan el carrito y la ventana de detalle)
let temporizadorAviso;
window.mostrarAviso = function (mensaje) {
    const aviso = document.getElementById("aviso");
    aviso.textContent = mensaje;
    aviso.classList.add("visible");
    clearTimeout(temporizadorAviso);
    temporizadorAviso = setTimeout(() => aviso.classList.remove("visible"), 2200);
};

document.getElementById("form-newsletter")?.addEventListener("submit", e => {
    e.preventDefault();
    e.target.reset();
    window.mostrarAviso("¡Listo! Ya eres parte del club.");
});

mostrarProductos();