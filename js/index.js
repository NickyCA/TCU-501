/* eslint-disable import/extensions */
import Common from './common.js';


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
    confirmButtonText: 'Iniciar',
    showCancelButton: true,
    cancelButtonText: 'Cancelar',
    confirmButtonColor: Common.GetBaseColorOne(),
    cancelButtonColor: Common.GetBaseColorTwo(),
    progressSteps: ['1'],
  }).queue([
    {
      title: 'Nombre',
      text: 'Introduzca su nombre de jugador',
    },
  ]).then((result) => {
    if (result.value) {
      if (validateUserInput(result.value, true)) {
        localStorage.setItem('playerName', result.value[0]);
        loadWaitingRoom(response);
      }
    }
  });
}

function loadWaitingRoom(response) {
  localStorage.setItem('state', 'toWaitingRoom');
  localStorage.setItem('playerId', response.playerId);
  localStorage.setItem('gameId', response.gameId);

  window.open(response.redirect, '_self');
}

function addEvents() {
  // Agregar evento al botón de crear sesión.
  const create = document.getElementById('create');
  create.addEventListener('click', askUserHostGuestGameInfo);

  // Agregar evento al botón de ayuda
  const help = document.getElementById('help-img-button');
  help.addEventListener('click', Common.showHelp);
}

/*
Función inicial.
*/
function init() {
  localStorage.setItem('state', 'initial');
  addEvents();
}

// Espera a que se cargue la pagina para iniciar la funcion de init
window.addEventListener('load', init);
