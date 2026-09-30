// ===== MEGA PACA SHOP: lógica principal =====

// Respaldo por si se abre index.html directo (file://) y el navegador bloquea fetch
const PRODUCTOS_RESPALDO = [
    { id: 1, nombre: "Chumpa de mezclilla vintage", categoria: "ropa", precio: 95, emoji: "🧥", color: "#4997D0", etiqueta: "Paca del día" },
    { id: 2, nombre: "Suéter tejido talla M", categoria: "ropa", precio: 60, emoji: "🧶", color: "#D6403A", etiqueta: "" },
    { id: 3, nombre: "Jeans clásicos americanos", categoria: "ropa", precio: 75, emoji: "👖", color: "#1E8A5A", etiqueta: "Más pedido" },
    { id: 4, nombre: "Vestido floral de temporada", categoria: "ropa", precio: 85, emoji: "👗", color: "#F2B600", etiqueta: "" },
    { id: 5, nombre: "Tenis deportivos de marca", categoria: "calzado", precio: 150, emoji: "👟", color: "#4997D0", etiqueta: "Chilero" },
    { id: 6, nombre: "Botas de cuero", categoria: "calzado", precio: 180, emoji: "🥾", color: "#D6403A", etiqueta: "" },
    { id: 7, nombre: "Bolso de mano", categoria: "accesorios", precio: 70, emoji: "👜", color: "#F2B600", etiqueta: "" },
    { id: 8, nombre: "Gorra de béisbol", categoria: "accesorios", precio: 35, emoji: "🧢", color: "#1E8A5A", etiqueta: "Precio de paca" }
];

window.PRODUCTOS = [];
let categoriaActual = "todos";
let textoBusqueda = "";

const contenedor = document.getElementById("contenedor-productos");

function formatoQuetzales(valor) {
    return "Q" + Number(valor).toFixed(2);
}
window.formatoQuetzales = formatoQuetzales;

// Fondo suave a partir del color del producto
function fondoSuave(color) {
    return color + "26"; // ~15% de opacidad
}
window.fondoSuave = fondoSuave;

async function cargarProductos() {
    try {
        const respuesta = await fetch("datos/productos.json");
        if (!respuesta.ok) throw new Error("No se pudo leer productos.json");
        window.PRODUCTOS = await respuesta.json();
    } catch (error) {
        console.warn("Usando productos de respaldo:", error.message);
        window.PRODUCTOS = PRODUCTOS_RESPALDO;
    }
    mostrarProductos();
}

function mostrarProductos() {
    const texto = textoBusqueda.trim().toLowerCase();
    const lista = window.PRODUCTOS.filter(p =>
        (categoriaActual === "todos" || p.categoria === categoriaActual) &&
        p.nombre.toLowerCase().includes(texto)
    );

    if (lista.length === 0) {
        contenedor.innerHTML = '<p class="sin-resultados">No encontramos productos con ese filtro. Prueba con otra búsqueda.</p>';
        return;
    }

    contenedor.innerHTML = lista.map(p => `
        <article class="tarjeta-producto">
            <div class="tarjeta-imagen" style="background:${fondoSuave(p.color)}">
                ${p.etiqueta ? `<span class="etiqueta-producto">${p.etiqueta}</span>` : ""}
                <span class="emoji" aria-hidden="true">${p.emoji}</span>
            </div>
            <div class="tarjeta-info">
                <h3>${p.nombre}</h3>
                <p class="tarjeta-categoria">${p.categoria}</p>
                <p class="tarjeta-precio">${formatoQuetzales(p.precio)}</p>
                <button class="btn-agregar" data-id="${p.id}">AGREGAR AL CARRITO</button>
            </div>
        </article>
    `).join("");
}

function cambiarCategoria(categoria) {
    categoriaActual = categoria;
    document.querySelectorAll(".btn-filtro").forEach(btn => {
        btn.classList.toggle("activo", btn.dataset.filtro === categoria);
    });
    mostrarProductos();
}

// Botones de filtro
document.querySelectorAll(".btn-filtro").forEach(btn => {
    btn.addEventListener("click", () => cambiarCategoria(btn.dataset.filtro));
});

// Enlaces del menú con categoría
const menu = document.getElementById("menu-navegacion");
menu.querySelectorAll("a[data-categoria]").forEach(enlace => {
    enlace.addEventListener("click", () => {
        cambiarCategoria(enlace.dataset.categoria);
        menu.classList.remove("abierto");
    });
});

// Menú móvil
document.getElementById("btn-menu-movil").addEventListener("click", () => {
    menu.classList.toggle("abierto");
});

// Búsqueda
const barraBusqueda = document.getElementById("barra-busqueda");
const inputBusqueda = document.getElementById("input-busqueda");
document.getElementById("btn-buscar").addEventListener("click", () => {
    barraBusqueda.classList.toggle("abierta");
    if (barraBusqueda.classList.contains("abierta")) inputBusqueda.focus();
});
inputBusqueda.addEventListener("input", () => {
    textoBusqueda = inputBusqueda.value;
    mostrarProductos();
    if (textoBusqueda) document.getElementById("productos").scrollIntoView();
});

// Aviso breve (lo usa también el carrito)
let temporizadorAviso;
window.mostrarAviso = function (mensaje) {
    const aviso = document.getElementById("aviso");
    aviso.textContent = mensaje;
    aviso.classList.add("visible");
    clearTimeout(temporizadorAviso);
    temporizadorAviso = setTimeout(() => aviso.classList.remove("visible"), 2200);
};

// Newsletter
document.getElementById("form-newsletter").addEventListener("submit", e => {
    e.preventDefault();
    e.target.reset();
    window.mostrarAviso("¡Listo! Ya eres parte del club.");
});

cargarProductos();
