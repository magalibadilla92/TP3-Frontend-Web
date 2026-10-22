const catalogo = document.getElementById("catalogo");
const buscador = document.getElementById("buscador");
const filtroCategoria = document.getElementById("filtroCategoria");
const precioMaximo = document.getElementById("precioMaximo");
const contenidoCarrito = document.getElementById("contenidoCarrito");
const totalElemento = document.getElementById("total");
const modal = document.getElementById("modalProducto");
const detalleProducto = document.getElementById("detalleProducto");

let productos = [];
let carrito = [];

// Convierte texto a minúsculas y elimina acentos para facilitar la búsqueda.
function normalizar(texto) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

// Carga los productos desde el archivo JSON.
async function cargarProductos() {
  try {
    const respuesta = await fetch("productos.json");
    productos = await respuesta.json();
    mostrarProductos(productos);
  } catch (error) {
    catalogo.innerHTML = "<p>No se pudieron cargar los productos.</p>";
    console.error(error);
  }
}

function mostrarProductos(lista) {
  catalogo.innerHTML = "";

  document.getElementById("mensajeVacio").hidden = lista.length > 0;

  lista.forEach(producto => {
    const tarjeta = document.createElement("article");
    tarjeta.className = "producto";

    tarjeta.innerHTML = `
      <img src="${producto.imagen}" alt="${producto.nombre}">
      <div class="producto-info">
        <h3>${producto.nombre}</h3>
        <p class="precio">$${producto.precio}</p>
        <p>Stock: ${producto.stock}</p>
        <button class="btn btn-sm btn-outline-primary ver-detalle">
          Ver detalle
        </button>
        <button class="btn btn-sm btn-primary agregar">
          Agregar
        </button>
      </div>
    `;

    tarjeta.querySelector(".ver-detalle").addEventListener("click", () => {
      abrirModal(producto);
    });

    tarjeta.querySelector(".agregar").addEventListener("click", () => {
      agregarAlCarrito(producto.id);
    });

    catalogo.appendChild(tarjeta);
  });
}

function filtrarProductos() {
  const texto = normalizar(buscador.value.trim());
  const categoria = filtroCategoria.value;
  const maximo = Number(precioMaximo.value);

  const filtrados = productos.filter(producto => {
    const coincideNombre = normalizar(producto.nombre).includes(texto);
    const coincideCategoria = categoria === "" || producto.categoria === categoria;
    const coincidePrecio = precioMaximo.value === "" || producto.precio <= maximo;

    return coincideNombre && coincideCategoria && coincidePrecio;
  });

  mostrarProductos(filtrados);
}

function abrirModal(producto) {
  detalleProducto.innerHTML = `
    <img src="${producto.imagen}" alt="${producto.nombre}">
    <h2 class="mt-3">${producto.nombre}</h2>
    <p>${producto.descripcion}</p>
    <p><strong>Categoría:</strong> ${producto.categoria}</p>
    <p><strong>Precio:</strong> $${producto.precio}</p>
    <p><strong>Stock disponible:</strong> ${producto.stock}</p>
    <button id="agregarDesdeModal" class="btn btn-primary">
      Agregar al carrito
    </button>
  `;

  modal.hidden = false;

  document.getElementById("agregarDesdeModal").addEventListener("click", () => {
    agregarAlCarrito(producto.id);
  });
}

document.getElementById("cerrarModal").addEventListener("click", () => {
  modal.hidden = true;
});

modal.addEventListener("click", evento => {
  if (evento.target === modal) modal.hidden = true;
});

function agregarAlCarrito(id) {
  const producto = productos.find(p => p.id === id);
  const item = carrito.find(p => p.id === id);
  const cantidadActual = item ? item.cantidad : 0;

  if (cantidadActual >= producto.stock) {
    alert("No hay más unidades disponibles de este producto.");
    return;
  }

  if (item) {
    item.cantidad++;
  } else {
    carrito.push({ ...producto, cantidad: 1 });
  }

  mostrarCarrito();
}

function cambiarCantidad(id, cambio) {
  const item = carrito.find(p => p.id === id);
  const producto = productos.find(p => p.id === id);

  if (!item) return;

  const nuevaCantidad = item.cantidad + cambio;

  if (nuevaCantidad > producto.stock) {
    alert("Alcanzaste el stock disponible.");
    return;
  }

  if (nuevaCantidad <= 0) {
    carrito = carrito.filter(p => p.id !== id);
  } else {
    item.cantidad = nuevaCantidad;
  }

  mostrarCarrito();
}

function mostrarCarrito() {
  contenidoCarrito.innerHTML = "";

  carrito.forEach(item => {
    const fila = document.createElement("div");
    fila.className = "item-carrito";

    fila.innerHTML = `
      <div>
        <strong>${item.nombre}</strong><br>
        $${item.precio} × ${item.cantidad}
      </div>
      <div>
        <button class="btn btn-sm btn-outline-secondary menos">−</button>
        <button class="btn btn-sm btn-outline-secondary mas">+</button>
      </div>
    `;

    fila.querySelector(".menos").addEventListener("click", () => {
      cambiarCantidad(item.id, -1);
    });

    fila.querySelector(".mas").addEventListener("click", () => {
      cambiarCantidad(item.id, 1);
    });

    contenidoCarrito.appendChild(fila);
  });

  const total = carrito.reduce((suma, item) => {
    return suma + item.precio * item.cantidad;
  }, 0);

  totalElemento.textContent = `$${total}`;
}

document.getElementById("vaciarCarrito").addEventListener("click", () => {
  carrito = [];
  mostrarCarrito();
});

buscador.addEventListener("input", filtrarProductos);
filtroCategoria.addEventListener("change", filtrarProductos);
precioMaximo.addEventListener("input", filtrarProductos);

cargarProductos();