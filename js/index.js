const baseColorOne = '#f27294';
const baseColorTwo = '#f2dc6b';
const baseColorOnergba = 'rgba(242,114,148,0.1)';
const baseColorGrayrgba = 'rgba(240,240,240,0.1)';

function showHelp() {
  const htmlHelp = `<div class="help-content">
  <h3>Rules</h3>
  <ul>
  <li>The player will have a set of cards assigned for them to find.</li>
  <li>The cards assigned to the player will consist only of the name, they will not be the same as the images presented on the board.</li> 
  <li>The player will need to associate the word (his cards) with an image in the game board.</li>
  <li>Once the player has found all of the cards matching the words, a message indicating that he has won will appear and a new game will be created (with the same game settings).</li>
  <li>If the winning button is selected, the player will need to press it once he has found all the cards. The winning message will not appear by itself.</li>
  </ul>
  <h3>Credits</h3>

  <div>`;
  Swal.fire({
    title: 'Help',
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
 
  