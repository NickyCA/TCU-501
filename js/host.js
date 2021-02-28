/* eslint-disable import/extensions */
import Common from './common.js';
import WaitingCommon from './waitingCommon.js';

const socket = io();

/**
 * Revisa que las configuraciones de la partida seleccionadas sean validos
 * Genera mensajes especificos para cada error
 * @param {int} objectsQuantity
 * @param {int} gameType
 * @param {int} gamePointsRounds
 * @param {int} playersCardsQuantity
 */
function gameOptionsValidate(objectsQuantity, gameType,
  gamePointsRounds, playersCardsQuantity) {
  const errors = [];
  if (Number.isNaN(objectsQuantity)) {
    errors.push('Non valid input for amount of objects on board');
  }

  if (Number.isNaN(gameType)) {
    errors.push('Non valid input for game type');
  }

  if (Number.isNaN(gamePointsRounds)) {
    errors.push('Non valid input for amount of rounds or points');
  }

  if (gamePointsRounds <= 0) {
    errors.push('Amount of point or rounds must me above 0');
  }

  if (Number.isNaN(playersCardsQuantity)) {
    errors.push('Non valid input for amount of cards per player');
  }

  if (objectsQuantity > 100) {
    errors.push('Amount of objects on board must me less than 100');
  }

  const playersInGame = localStorage.getItem('playersInGame');
  const neededCardsTotal = playersInGame * playersCardsQuantity;
  if (neededCardsTotal > objectsQuantity) {
    errors.push('Not enough cards per player');
  }

  return errors;
}

/**
 * Envia el mensaje de gameStart al servidor
 * @param {Array} gameOptions
 */
function generateStartGameMessage(gameOptions) {
  const message = {
    messageType: 'gameStart',
    gameId: localStorage.getItem('gameId'),
    gameOptions,
  };
  return JSON.stringify(message);
}

/**
 * Obtiene todos los inputs que selecciono el usuario para la configuracion de la partida
 * los valida
 * y envia un mensaje al servidor
 */
function startGame() {
  const objectsQuantity = parseInt(document.getElementById('input_objects_quantity').value, 10);
  const gameType = parseInt(document.getElementById('input_game_type').value, 10);
  const gamePointsRounds = parseInt(document.getElementById('input_round_points_quantity').value, 10);
  const playersCardsQuantity = parseInt(document.getElementById('input_playercards_quantity').value, 10);
  const stopButton = document.getElementById('chk_winner_option').checked;
  const trapCard = parseInt(document.getElementById('input_trapcard_time').value, 10);

  const errors = gameOptionsValidate(objectsQuantity, gameType,
    gamePointsRounds, playersCardsQuantity);

  if (errors.length === 0) {
    const gameOptions = {
      objectsQuantity,
      gameType,
      gamePointsRounds,
      playersCardsQuantity,
      stopButton,
      trapCard,
    };

    socket.emit('fromClient', generateStartGameMessage(gameOptions));
  } else {
    Common.showInputsError(errors, 'Error: Game could not begin');
  }
}

/**
 * En el panel de configuraciones, dependiendo de si se elige por rondas o por puntos
 * se cambia la etiqueta donde esta el espacio para que el usuario diga el numero de rondas/puntos
 * de preferencia
 */
function changeGameTypeLabel() {
  const gameTypeValue = parseInt(document.getElementById('input_game_type').value, 10);
  const labelText = document.getElementById('round_points_quantity');
  if (gameTypeValue === 1) {
    labelText.innerText = 'Amount of points:';
  } else if (gameTypeValue === 2) {
    labelText.innerText = 'Amount of rounds:';
  }
}

/**
 * Asocia a los botones/dropdown de abandonar, iniciar partida, tipo de juego o de ayuda
 * sus correspondientes eventos
 */
function addEvents() {
  // Agregar evento al botón de abandonar
  const leave = document.getElementById('leave');
  leave.addEventListener('click', () => { Common.exitConfirm(socket); });

  // boton temporal
  const initGame = document.getElementById('initGame');
  initGame.addEventListener('click', startGame);

  // Cambio de tipo de juego
  const gameType = document.getElementById('input_game_type');
  gameType.addEventListener('change', changeGameTypeLabel);

  // Agregar evento al botón de ayuda
  const help = document.getElementById('help-img-button');
  help.addEventListener('click', Common.showHelp);
}

/**
 * Al terminarse una partida se llenan los campos de las configuraciones con aquellas elegidas
 * en la partida recien terminada
 */
function completeGameOptions() {
  const state = localStorage.getItem('state');

  if (state === 'returningToWaitingRoom') {
    const savedGameData = localStorage.getItem('gameInitialData');
    const game = JSON.parse(savedGameData);

    const objectsQuantity = document.getElementById('input_objects_quantity');
    const gameType = document.getElementById('input_game_type');
    const gamePointsRounds = document.getElementById('input_round_points_quantity');
    const playersCardsQuantity = document.getElementById('input_playercards_quantity');
    const stopButton = document.getElementById('chk_winner_option');
    const trapCard = document.getElementById('input_trapcard_time');

    objectsQuantity.value = parseInt(game.options.objectsQuantity, 10);
    gameType.value = parseInt(game.options.gameType, 10);
    gamePointsRounds.value = parseInt(game.options.points, 10);
    playersCardsQuantity.value = parseInt(game.options.playersCards, 10);
    stopButton.checked = game.options.stopButton;
    trapCard.value = game.options.trapCard;

    changeGameTypeLabel();
  }
}

/*
  Función de inicializacion.
  */
function init() {
  completeGameOptions();
  // const gameId = localStorage.getItem('gameId');
  WaitingCommon.joinGameRoom(socket);
  WaitingCommon.insertGameId();
  WaitingCommon.askForPlayersMessage(socket);
  WaitingCommon.messagesListener(socket);
  WaitingCommon.showHistoricalStats();
  addEvents();

  localStorage.setItem('state', 'setOptions');
  localStorage.setItem('host', 'true');
}

// Espera a que se cargue la pagina para iniciar la funcion de init
window.addEventListener('load', init);
