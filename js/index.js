const baseColorOne = '#f27294';
const baseColorTwo = '#f2dc6b';
const baseColorOnergba = 'rgba(242,114,148,0.1)';
const baseColorGrayrgba = 'rgba(240,240,240,0.1)';

function showHelp() {
    const htmlHelp = `<div class="help-content">
    <h3>Reglas del juego</h3>
    <ul>
    <li>Cada jugador tratará de encontrar las cartas asignadas en el tablero</li>
    <li>Las cartas asignadas se mostrarán sin color, sin embargo, en el tablero los colores variaran.</li> 
    <li>Si se juega por rondas, cada ronda deberán encontrarse la cantidad de cartas configuradas por el anfitrión.</li>
    <li>Si se juega por puntos, independientemente del número de cartas faltantes por encontrar, si se ha alcanzado la cantidad de puntos configurado. 
    por el anfitrión entonces dicho jugador ganará.</li>
    <li>Si se activa el botón de ganador, deberá presionarse este botón para indicar que se ha ganado la partida, de lo contrario
    el juego no anunciará un ganador hasta que alguien lo presione (y haya encontrado todas sus cartas).</li>
    <li>Si se activa la carta trampa, podrá ocultarse una carta de un contrincante. Solo se puede una por ronda.</li>
    </ul>
    <h3>Credits</h3>

    <div>`;
    Swal.fire({
      title: 'Ayuda',
      icon: 'info',
      html: htmlHelp,
      showCloseButton: true,
      focusConfirm: true,
      confirmButtonText:
        'Listo',
      confirmButtonColor: baseColorOne,
    });
  }

  function validateUserInput(data, host = false) {
    const errors = [];
    let result = true;
  
    if (data[0].trim().length === 0) {
      errors.push('Debe introducir un nombre de jugador.');
    }
  
    if (host === false && data[1].trim().length === 0) {
      errors.push('Debe introducir un ID de sesión para unirse.');
    }
  
    if (errors.length > 0) {
      result = false;
      Common.showInputsError(errors, 'No se puede ingresar a la partida');
    }
  
    return result;
  }

  function askUserHostGuestGameInfo() {
    Swal.mixin({
      input: 'text',
      confirmButtonText: 'Start',
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      confirmButtonColor: baseColorOne,
      cancelButtonColor: baseColorTwo,
      progressSteps: ['1'],
    }).queue([
      {
        title: 'Name',
        text: 'Please enter your name',
      },
    ]).then((result) => {
      if (result.value) {
        if (validateUserInput(result.value, true)) {
          localStorage.setItem('playerName', result.value[0]);
          redirectFunctionWaiting();
        }
      }
    });
  }

function redirectFunctionWaiting() {
    window.location.href = "./sala_espera.xhtml";
  }
  
  function redirectFunctionHelp() {
    window.location.href = "./help.xhtml";
  }
  
  function addEvents() {
    // Agregar evento al botón de crear sesión.
    const create = document.getElementById('create');
  create.addEventListener('click', askUserHostGuestGameInfo);
  
  
    // Agregar evento al botón de ayuda
    const help = document.getElementById('help-img-button');
    help.addEventListener('click', showHelp);
  }

  
  /*
  Función inicial.
  */
  function init() {
    addEvents();
  }
  
  // Espera a que se cargue la pagina para iniciar la funcion de init
  window.addEventListener('load', init);
 
  