/* eslint-disable import/extensions */
import Common from './common.js';
import WaitingCommon from './waitingCommon.js';

const socket = io();

/**
 * Asocia a los botones de abandonar y ayuda los correspondientes eventos
 */
function addEvents() {
  // Agregar evento al botón de abandonar
  const leave = document.getElementById('leave');
  leave.addEventListener('click', () => { Common.exitConfirm(socket); });

  // Agregar evento al botón de ayuda
  const help = document.getElementById('help-img-button');
  help.addEventListener('click', Common.showHelp);
}

/*
  Función de inicializacion.
  */
function init() {
  WaitingCommon.joinGameRoom(socket);
  WaitingCommon.insertGameId();
  WaitingCommon.askForPlayersMessage(socket);
  WaitingCommon.messagesListener(socket);
  WaitingCommon.showHistoricalStats();
  addEvents();

  localStorage.setItem('state', 'waiting');
}

// Espera a que se cargue la pagina para iniciar la funcion de init
window.addEventListener('load', init);
