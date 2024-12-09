const ventana = document.querySelector(".ventana"); // Selecciona el elemento de ventana

let ventanaMinimizada = false; // Indica si el elemento de ventana esta minimizado

let posicionVentana = JSON.parse(sessionStorage.getItem("ventana")); // Obtiene la posición de la ventana desde el almacenamiento de sesión

/* Establece la posición top y left del elemento de ventana */
ventana.style.top = posicionVentana?.top || "40%"; 
ventana.style.left = posicionVentana?.left || "40%";
/**
 * Alterna el estado minimizado del elemento de ventana.
 * Si el elemento objetivo tiene el ID "minimizar", alterna el estado minimizado.
 * Actualiza el estilo y los listeners de eventos del elemento de ventana 
 * para reflejar el estado minimizado y viceversa. La posición se
 * recupera desde sessionStorage para mantener la posición de la ventana 
 * al restaurarla.
 *
 * @param {Event} e - El objeto del evento proveniente del clic en el elemento ventana.
 */
function minimizar(e) {
  const elemento = e.target;
  if (elemento.id !== "minimizar") return;
  ventanaMinimizada = !ventanaMinimizada;
  elemento.classList.toggle("minimizado");
  ventana.classList.toggle("ventana--minimizada");
  ventana.style = "";
  if (ventanaMinimizada) {
    ventana.style.bottom = "0px";
    ventana.style.left = "0px";
    ventana.removeEventListener("mousedown", moverVentana);
  } else {
    let { top, left } = JSON.parse(sessionStorage.getItem("ventana"));
    ventana.style.top = top;
    ventana.style.left = left;
    ventana.addEventListener("mousedown", moverVentana);
  }
}

/**
 * Maneja el movimiento de arrastrar y soltar del elemento de ventana.
 * Inicia el arrastre cuando se presiona el mouse en el encabezado o en el título del encabezado,
 * rastrea el movimiento del mouse y actualiza la posición de la ventana en consecuencia.
 * La posición se guarda en sessionStorage para mantener el estado incluso después de recargar la página.
 *
 * @param {Event} e - El evento de mouse disparado al presionar el botón del mouse (mousedown).
 */
function moverVentana(e) {
  const elemento = e.target;

  let desplazamientoX = 0, // Diferencia horizontal al arrastrar
    desplazamientoY = 0, // Diferencia vertical al arrastrar
    posicionInicialX = 0, // Posición inicial del puntero en X
    posicionInicialY = 0; // Posición inicial del puntero en Y

  if (elemento.id == "encabezado" || elemento.id == "encabezadoTitulo") {
    iniciarArrastre(elemento);
  }

  function iniciarArrastre(e) {
    posicionInicialX = e.clientX;
    posicionInicialY = e.clientY;

    document.onmouseup = finalizarArrastre;
    document.onmousemove = arrastrarElemento;
  }

  /**
   * Actualiza la posición del elemento de ventana según el movimiento del puntero.
   * Desplaza el elemento en función de la diferencia entre la posición actual y la
   * posición inicial del puntero, y actualiza la posición actual del puntero.
   * Llama a `actualizarPosicionElemento` para actualizar la posición del elemento
   * en el DOM.
   *
   * @param {MouseEvent} e - El evento de mouse disparado al mover el puntero
   * mientras se arrastra el elemento.
   */
  function arrastrarElemento(e) {
    desplazamientoX = posicionInicialX - e.clientX;
    desplazamientoY = posicionInicialY - e.clientY;
    posicionInicialX = e.clientX;
    posicionInicialY = e.clientY;

    actualizarPosicionElemento();
  }

  /**
   * Actualiza la posición del elemento de ventana en el DOM y en sessionStorage.
   * Desplaza el elemento en función de la diferencia entre la posición actual y la
   * posición inicial del puntero, y actualiza la posición actual del puntero.
   * Llama a `sessionStorage.setItem` para guardar la posición actual del elemento
   * en el almacenamiento de sesión.
   */
  function actualizarPosicionElemento() {
    ventana.style.top = ventana.offsetTop - desplazamientoY + "px";
    ventana.style.left = ventana.offsetLeft - desplazamientoX + "px";
    sessionStorage.setItem(
      "ventana",
      JSON.stringify({
        top: ventana.style.top,
        left: ventana.style.left,
      })
    );
  }

  /**
   * Limpia los listeners de eventos para que el arrastre del elemento se detenga.
   * Limpia los listeners de `document.onmouseup` y `document.onmousemove` para
   * detener el arrastre del elemento.
   */
  function finalizarArrastre() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

ventana.addEventListener("click", minimizar); // Escucha el clic en el botón minimizar
ventana.addEventListener("mousedown", moverVentana); // Escucha el arrastre del mouse
