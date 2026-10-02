// ===== DATOS DE PRODUCTOS DE MEGA PACA SHOP =====
// Aquí se editan los productos (nombre, precio, tallas, fotos).
//
// DÓNDE VAN LAS FOTOS:
//   imagenes/ropa/         -> fotos de ropa
//   imagenes/calzado/      -> fotos de calzado
//   imagenes/accesorios/   -> fotos de accesorios
// En "imagenes" se escribe la ruta de cada foto. La PRIMERA es la foto principal
// (la que sale en la tarjeta) y las demás salen como miniaturas en la ventana emergente.
// El nombre del archivo debe ser IGUAL al de aquí, en minúsculas (ej: chumpa-mezclilla-1.jpg).
// Si una foto no existe, la tienda muestra el emoji en su lugar y no se rompe.
//
// "tallas": [] significa talla única (no se pide elegir talla).
// "precioAnterior" es opcional: muestra el precio tachado y el % de descuento.

const PRODUCTOS_DATA = [
    {
        id: 1, nombre: "Chumpa de mezclilla vintage", categoria: "ropa", precio: 95, precioAnterior: 130,
        emoji: "🧥", color: "#4997D0", etiqueta: "Paca del día",
        tallas: ["XS", "S", "M", "L", "XL"],
        descripcion: "Chumpa de mezclilla azul oscuro con cierre y cuello alto. Ropa americana en excelente estado.",
        imagenes: [
            "imagenes/ropa/chumpa vintage.webp",
            "imagenes/ropa/chumpa vintage 2.webp",
            "imagenes/ropa/chumpa vintage 3.webp"
        ]
    },
    {
        id: 2, nombre: "Suéter tejido", categoria: "ropa", precio: 67,
        emoji: "🧶", color: "#D6403A", etiqueta: "",
        tallas: ["S", "M", "L", "XL"],
        descripcion: "Suéter tejido grueso, calientito para las mañanas frías de Xela o la capital.",
        imagenes: [
            "imagenes/ropa/sueter1.webp",
            "imagenes/ropa/sueter2.webp",
            "imagenes/ropa/sueter3.webp"
        ]
    },
    {
        id: 3, nombre: "Jeans clásicos americanos", categoria: "ropa", precio: 75, precioAnterior: 100,
        emoji: "👖", color: "#1E8A5A", etiqueta: "Más pedido",
        tallas: ["28", "30", "32", "34", "36"],
        descripcion: "Jeans de corte clásico, mezclilla resistente y cómoda. Ideales para todos los días.",
        imagenes: [
            "imagenes/ropa/jeans-clasicos-1.jpg",
            "imagenes/ropa/jeans-clasicos-2.jpg",
            "imagenes/ropa/jeans-clasicos-3.jpg"
        ]
    },
    {
        id: 4, nombre: "Vestido floral de temporada", categoria: "ropa", precio: 85,
        emoji: "👗", color: "#F2B600", etiqueta: "",
        tallas: ["XS", "S", "M", "L"],
        descripcion: "Vestido floral ligero, perfecto para salidas y fiestas.",
        imagenes: [
            "imagenes/ropa/vestido-floral-1.jpg",
            "imagenes/ropa/vestido-floral-2.jpg",
            "imagenes/ropa/vestido-floral-3.jpg"
        ]
    },
    {
        id: 5, nombre: "Tenis deportivos de marca", categoria: "calzado", precio: 150,
        emoji: "👟", color: "#4997D0", etiqueta: "Chilero",
        tallas: ["36", "37", "38", "39", "40", "41", "42"],
        descripcion: "Tenis deportivos de marca en muy buen estado, suela firme y cómoda.",
        imagenes: [
            "imagenes/calzado/tenis-deportivos-1.jpg",
            "imagenes/calzado/tenis-deportivos-2.jpg"
        ]
    },
    {
        id: 6, nombre: "Botas de cuero", categoria: "calzado", precio: 180,
        emoji: "🥾", color: "#D6403A", etiqueta: "",
        tallas: ["37", "38", "39", "40", "41", "42"],
        descripcion: "Botas de cuero resistentes, hechas para durar.",
        imagenes: [
            "imagenes/calzado/botas-cuero-1.jpg",
            "imagenes/calzado/botas-cuero-2.jpg"
        ]
    },
    {
        id: 7, nombre: "Bolso de mano", categoria: "accesorios", precio: 70,
        emoji: "👜", color: "#F2B600", etiqueta: "",
        tallas: [],
        descripcion: "Bolso de mano con espacio para lo esencial. Talla única.",
        imagenes: [
            "imagenes/accesorios/bolso-mano-1.jpg",
            "imagenes/accesorios/bolso-mano-2.jpg"
        ]
    },
    {
        id: 8, nombre: "Gorra de béisbol", categoria: "accesorios", precio: 35,
        emoji: "🧢", color: "#1E8A5A", etiqueta: "Precio de paca",
        tallas: [],
        descripcion: "Gorra de béisbol ajustable. Talla única.",
        imagenes: [
            "imagenes/accesorios/gorra-beisbol-1.jpg",
            "imagenes/accesorios/gorra-beisbol-2.jpg"
        ]
    }
];