const opciones = ["piedra", "papel", "tijera"];

let victorias = 0;
let derrotas = 0;
let empates = 0;

const jugadorTexto = document.getElementById("jugador");
const computadoraTexto = document.getElementById("computadora");
const mensaje = document.getElementById("mensaje");

const victoriasTexto = document.getElementById("victorias");
const derrotasTexto = document.getElementById("derrotas");
const empatesTexto = document.getElementById("empates");

function jugar(eleccionJugador) {
  // La computadora elige al azar una de las tres opciones.
  const indiceAleatorio = Math.floor(Math.random() * opciones.length);
  const eleccionComputadora = opciones[indiceAleatorio];

  jugadorTexto.textContent = eleccionJugador;
  computadoraTexto.textContent = eleccionComputadora;

  if (eleccionJugador === eleccionComputadora) {
    mensaje.textContent = "¡Empate!";
    empates++;
  } else if (
    (eleccionJugador === "piedra" && eleccionComputadora === "tijera") ||
    (eleccionJugador === "papel" && eleccionComputadora === "piedra") ||
    (eleccionJugador === "tijera" && eleccionComputadora === "papel")
  ) {
    mensaje.textContent = "¡Ganaste esta ronda!";
    victorias++;
  } else {
    mensaje.textContent = "Ganó la computadora.";
    derrotas++;
  }

  actualizarMarcador();
}

function actualizarMarcador() {
  victoriasTexto.textContent = victorias;
  derrotasTexto.textContent = derrotas;
  empatesTexto.textContent = empates;
}

// Cada botón inicia una ronda con la opción elegida.
document.querySelectorAll(".opcion").forEach(boton => {
  boton.addEventListener("click", () => {
    jugar(boton.dataset.eleccion);
  });
});

// Reinicia el marcador y los mensajes.
document.getElementById("reiniciar").addEventListener("click", () => {
  victorias = 0;
  derrotas = 0;
  empates = 0;

  jugadorTexto.textContent = "—";
  computadoraTexto.textContent = "—";
  mensaje.textContent = "¡Elegí para comenzar!";

  actualizarMarcador();
});