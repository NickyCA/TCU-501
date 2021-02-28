/**
 * Cantidad máxima permitida de objetos por tablero.
 */
const objectTotal = 375;

/**
 * Permite trabajar con el objeto PlayerData.
 */
const players = require('./playerData');

/**
 * Permite trabajar con el objeto PlayerData.
 */
const { PlayerData } = players;

/**
 * Almacena toda la información de las partidas.
 */
const gamesData = [];

/**
 * Genera el id de las partidas.
 */
function getNewGameId() {
  return Math.ceil(Math.random() * (100000) + 10000).toString().padStart(5, '0');
}

/**
 * Clase que sirve para crear partidas.
 */
class GameData {
  /**
   * Constructor para la clase GameData.
   * @param {Number} objectsQuantity Cantidad de objetos de la partida.
   * @param {Number} gameType Tipo de Juego: 1 -> Por puntos | 2 -> Por rondas.
   * @param {Number} pointsRounds Cantidad de puntos o rondas para ganar.
   * @param {Number} playersCards Cantidad de cartas por jugador.
   * @param {Boolean} stopButton Habilita o deshabilita el botón de stop.
   */
  constructor(objectsQuantity, gameType, pointsRounds, playersCards, stopButton) {
    this.gameId = getNewGameId();
    this.objectsQuantity = objectsQuantity;
    this.gameType = gameType;
    this.points = pointsRounds;
    this.rounds = pointsRounds;
    this.playersCardsQuantity = playersCards;
    this.trapCard = 0;
    this.stopButton = stopButton;
    this.board = [];
    this.players = [];
    this.playing = false;
    this.winnerExists = false;
  }

  /**
   * Selecciona los objetos que se utilizaran en la partida.
   */
  generateGameBoardObjects() {
    // Obtiene los ids númericos de los objetos.
    const objects = [...Array(objectTotal).keys()];

    // Obtiene la cantidad de objetos configurada para la partida aleatoriamente.
    const randomObjects = objects.sort(() => 0.5 - Math.random())
      .slice(0, this.objectsQuantity);

    // Obtiene los ids de los objetos.
    this.board = randomObjects.map((val) => String(val + 1).padStart(3, '0'));
  }

  /**
   * Genera las cartas de los jugadores.
   */
  generatePlayerCards() {
    const tempBoard = [...this.board]; // Copia para ordenar diferente.
    const selectedCards = tempBoard.sort(() => 0.5 - Math.random())
      .slice(0, this.playersCardsQuantity * this.players.length);

    for (let index = 0; index < this.players.length; index += 1) {
      this.players[index].cards = selectedCards.slice(
        (this.playersCardsQuantity * index),
        ((this.playersCardsQuantity * index) + this.playersCardsQuantity),
      );
    }
  }

  /**
   * Elimina un jugador de la partida.
   * @param {String} playerId Id del Jugador
   *
   * @returns {String} Nombre del jugador que salió de la partida.
   */
  removePlayer(playerId) {
    const index = this.players.findIndex((p) => p.playerId === playerId);
    let playerName = '';
    if (index > -1) {
      playerName = this.players[index].name;

      this.players.splice(index, 1);
    }

    return playerName;
  }

  /**
   * Limpia los objetos del jugador.
   */
  resetPlayerCards() {
    this.winnerExists = false;

    for (let index = 0; index < this.players.length; index += 1) {
      this.players[index].cards = [];
      this.players[index].foundCards = [];
      this.players[index].trapCardUsed = false;
    }
  }

  /**
   * Configura la partida.
   * @param {Object} gameOptions Opciones del juego.
   */
  setGameOptions(gameOptions) {
    this.objectsQuantity = gameOptions.objectsQuantity;
    this.gameType = gameOptions.gameType;
    this.points = gameOptions.gamePointsRounds;
    this.rounds = gameOptions.gamePointsRounds;
    this.playersCardsQuantity = gameOptions.playersCardsQuantity;
    this.stopButton = gameOptions.stopButton;
    this.trapCard = gameOptions.trapCard;
  }

  /**
   * Se utiliza cuando hay una vuelta a la sala de espera si hay un ganador definitivo.
   */
  resetGame() {
    this.playing = false;
    for (let index = 0; index < this.players.length; index += 1) {
      this.players[index].points = 0;
      this.players[index].rounds = 0;
      this.players[index].trapCardUsed = false;
    }
  }
}

/**
 * Crea un mensaje de respuesta con la información de los jugadores
 * que están en la partida.
 * @param {Object} msg Contiene la información id de la partida.
 *
 * @returns {String} Mensaje a los clientes con la información de los jugadores.
 */
function playersResponse(msg) {
  const game = gamesData.find((x) => x.gameId === msg.gameId);
  let gamePlayers = [];

  if (game) {
    gamePlayers = game.players;
  }

  const message = {
    messageType: 'playersResponse',
    players: gamePlayers,
  };
  return JSON.stringify(message);
}

/**
 * Genera el mensaje inicial para entrar a la partida.
 * @param {String} playerId Id del jugador.
 * @param {String} gameId Id de la partida.
 * @param {Boolen} host Indica si el mensaje hay que enviarlo a un anfitrión
 * o a un invitado.
 *
 * @returns {String} Mensaje para entrar a la sala de espera.
 */
function initialResponseMessage(playerId, gameId, host) {
  let room = './salaespera';

  if (host === true) {
    room = './salaanfitrion';
  }

  const initialResponse = {
    messageType: 'initialResponse',
    playerId,
    gameId,
    redirect: room,
  };

  const returnMessage = JSON.stringify(initialResponse);

  return returnMessage;
}

/**
 * Genera un mensaje de error para enviar a un cliente.
 * @param {String} errorMsg Mensaje de error a enviar.
 *
 * @returns {String} Mensaje de error para un cliente.
 */
function createErrorMessage(errorMsg) {
  const errorResponse = {
    messageType: 'error',
    errorMsg,
  };

  const returnMessage = JSON.stringify(errorResponse);

  return returnMessage;
}

/**
 * Sirve para agregar los jugadores a la partida, en caso de que no exista la crea.
 * @param {Object} msg Contiene la información para crear una nueva partida.
 *
 * @returns {String} Mensaje de aceptación o de error para entrar a la partida.
 */
function receiveNewPlayer(msg) {
  let actualGame;

  if (msg.gameId === undefined || msg.gameId === '') {
    // Es una partida sin ID, debe crearla.
    actualGame = new GameData(50, 1, 5, 3, true);

    // Almacena el juego.
    gamesData.push(actualGame);
  } else {
    // Es una partida con ID, debe crearse en esa sesión.
    actualGame = gamesData.find((game) => game.gameId === msg.gameId);
  }

  // Validar si no encontró.
  let returnMessage = '';

  if (actualGame === undefined) {
    returnMessage = createErrorMessage(`Game with requested ID couldn't be found: ${msg.gameId}.`);
  } else if (actualGame.playing === true) {
    returnMessage = createErrorMessage(`Game with the ID: ${msg.gameId} already started.`);
  } else {
    const player = new PlayerData(msg.name);
    const playerId = actualGame.players.length + 1; // Cambiar para coger el ultimo y sumarle 1
    player.playerId = playerId.toString();

    // Agrega el usuario a los datos del juego.
    actualGame.players.push(player);

    // Retorna un mensaje con los datos del juego y jugador.
    returnMessage = initialResponseMessage(player.playerId, actualGame.gameId, msg.host);
  }

  return returnMessage;
}

/**
 * Genera un mensaje con las opciones de la partida.
 * @param {Object} gameData Datos de inicialización de la partida.
 *
 * @returns {String} Mensaje con los datos de la partida.
 */
function generateGameMessage(gameData) {
  const messageGame = {
    messageType: 'game',
    options: {
      objectsQuantity: gameData.objectsQuantity,
      gameType: gameData.gameType,
      points: gameData.points,
      rounds: gameData.rounds,
      playersCards: gameData.playersCardsQuantity,
      stopButton: gameData.stopButton,
      trapCard: gameData.trapCard,
    },
    board: gameData.board,
    players: gameData.players,
  };

  return JSON.stringify(messageGame);
}

/**
 * Genera un mensaje para reinicializar el juego.
 * @param {Object} gameData Datos del juego
 * @param {String} winner Id del ganador si ya existe.
 *
 * @returns {String} Mensaje con los datos de la nueva ronda.
 */
function generateGameResetMessage(gameData, winner) {
  const messageGame = {
    messageType: 'gameReset',
    board: gameData.board,
    players: gameData.players,
    winnerId: winner,
  };

  return JSON.stringify(messageGame);
}

/**
 * Comprueba si la partida ya tiene un ganador o no.
 * @param {Object} game Objeto con la partida almacenada.
 * @param {Object} player Información del jugador.
 * @param {String} winner Nombre del jugador, si existe.
 *
 * @returns {String} Mensaje con los datos actualizados de la partida.
 */
function checkGameRound(game, player, winner) {
  let message = '';
  let finalWinner = false;
  let winnerId = winner;

  if (game.gameType === 1) {
    // Si era partida por puntos.
    if (game.points <= player.points) {
      finalWinner = true;
      winnerId = player.playerId;
    }
  } else if (game.gameType === 2) {
    // Si era partida por rondas.
    if (game.rounds <= player.rounds) {
      finalWinner = true;
      winnerId = player.playerId;
    }
  }

  //  Si no hay ganador de juego y si hay ganador de ronda entonces regenera el juego.
  if (finalWinner === false && winnerId !== '') {
    game.resetPlayerCards();
    game.generateGameBoardObjects();
    game.generatePlayerCards();

    message = generateGameResetMessage(game, winnerId);
  } else {
    const playersTemp = [...game.players];
    message = {
      messageType: 'gameUpdateServer',
      players: playersTemp,
      winnerId,
    };

    message = JSON.stringify(message);

    if (finalWinner === true && winnerId !== '') {
      game.resetGame();
    }
  }

  return message;
}

/**
 * Genera un mensaje de actualización de la partida, respondiendo a un mensaje de un cliente.
 * @param {Object} msg Mensaje con una actualización de la partida desde un cliente.
 *
 * @returns {String} Mensaje con los datos de la partida actualizados.
 */
function generateGameUpdateMessage(msg) {
  // Obtiene el juego
  const game = gamesData.find((x) => x.gameId === msg.gameId);
  const player = game.players.find((p) => p.playerId === msg.playerId);
  let tempWinner = false;
  let winner = '';

  if (msg.cardId !== '') {
    if (player.cards.some((card) => card === msg.cardId)) {
      // Comprueba si la carta es del jugador y la agrega
      player.foundCards.push(msg.cardId);
      player.points += 1;
      player.historicPoints += 1;
    }
  }

  // Comprueba si ganó automáticamente.
  if (player.foundCards.length === game.playersCardsQuantity) {
    tempWinner = true;
  }

  // Si es un ganador temporal y no hay otro ganador ya entonces
  if (tempWinner === true && game.winnerExists === false) {
    if (game.stopButton === false) {
      // Si no está activa la opción de ganador, ganó temporalmente y no existe ya otro ganador
      // entonces lo declara ganador.
      winner = msg.playerId;
      game.winnerExists = true;
    } else if (msg.stopPressed === true) {
      // Si presionó el botón de stop
      winner = msg.playerId;
      game.winnerExists = true;
    } else {
      winner = '';
    }

    // Si ganó la ronda se le suma 1 punto.
    if (game.winnerExists === true) {
      player.rounds += 1;
      player.historicRounds += 1;
    }
  }

  // Verifica si se debe seguir jugando, generando un nuevo tablero y cartas
  // o era una partida que generó un ganador final
  const message = checkGameRound(game, player, winner);

  return message;
}

/**
 * Inicia la partida.
 * @param {Object} msg Mensaje con la información de la partida para iniciarla.
 *
 * @returns {String} Mensaje avisando a todos los clientes en la sala de juego para que cambien
 * al juego.
 */
function startGame(msg) {
  // Obtiene el juego que corresponda con el ID
  const game = gamesData.find((x) => x.gameId === msg.gameId);
  let responseStartGame;

  if (game.playing === false) {
    game.setGameOptions(msg.gameOptions);
    game.resetPlayerCards();
    game.generateGameBoardObjects();
    game.generatePlayerCards();
    game.playing = true;

    responseStartGame = generateGameMessage(game);
  }

  return responseStartGame;
}

/**
 * Saca al jugador del juego y avisa al resto de jugadores.
 * @param {Object} msg Mensaje con la información del jugador que está abandonando la partida.
 *
 * @returns {String} Mensaje con la información del jugador que abandonó la partida.
 */
function leaveGame(msg) {
  const game = gamesData.find((x) => x.gameId === msg.gameId);
  let returnMessage = '';
  if (game !== undefined) {
    const playerName = game.removePlayer(msg.playerId);

    const playerLeaveMessage = {
      messageType: 'playerLeave',
      playerName,
    };

    returnMessage = JSON.stringify(playerLeaveMessage);
  }

  return returnMessage;
}

/**
 * Finaliza la partida y la elimina. (Creo que no se usa)
 * @param {Object} msg Mensaje que indica que se debe finalizar la partida.
 *
 * @returns {String} Mensaje que indica que se eliminó la partida.
 */
function endGame(msg) {
  const game = gamesData.findIndex((x) => x.gameId === msg.gameId);
  if (game > -1) {
    gamesData.splice(game); // borra del array la partida terminada
    console.log('games data length: ', gamesData.length);
  }

  const endGameResponse = {
    messageType: 'endGameResponse',
    gameId: msg.gameId,
  };

  return JSON.stringify(endGameResponse);
}

/**
 * Genera el mensaje que avisa que se utilizó una carta trampa.
 * @param {Object} game Información de la partida.
 * @param {Boolean} correct Indica si se utilizó correctamente la carta trampa.
 * @param {String} card Id de la carta a ocultar.
 * @param {String} playerID Id del jugador que la activó.
 *
 * @returns {String} Mensaje con las opciones de la carta trampa.
 */
function generateTrapCardMsg(game, correct, card, playerID) {
  const trapCardResponse = {
    messageType: 'trapCardResponse',
    gameId: game,
    correctCard: correct,
    cardId: card,
    playerId: playerID,
  };
  return JSON.stringify(trapCardResponse);
}

/**
 * Analiza el mensaje de carta trampa.
 * @param {Object} msg Datos de la carta trampa.
 *
 * @returns {String} Mensaje con los datos validados.
 */
function trapCardResponseMsg(msg) {
  const game = gamesData.find((x) => x.gameId === msg.gameId);
  const otherPlayers = game.players.filter((player) => player.playerId !== msg.playerId);
  const playerCard = game.players.find((player) => player.playerId === msg.playerId);
  let correct = false;

  if (msg.cardId !== '') {
    for (let index = 0; index < otherPlayers.length; index += 1) {
      const player = otherPlayers[index];
      // que la carta pertenezca a un jugador y que no haya sido encontrada
      if (player.cards.some((card) => card === msg.cardId)
      && !(player.foundCards.some((foundCards) => foundCards === msg.cardId))) {
        playerCard.trapCardUsed = true;
        correct = true;
        break;
      }
    }
  }

  // Si no encuentra coincidencia entonces envia correct = false
  return generateTrapCardMsg(game.gameId, correct, msg.cardId, msg.playerId);
}

/**
 * Reciba un mensaje, lo analiza y responde.
 * @param {String} message Mensaje recibido.
 *
 * @returns {String} Respuesta al mensaje.
 */
function readMessage(message) {
  const msg = JSON.parse(message);
  let response;

  switch (msg.messageType) {
    case 'initial':
      response = { serverMsg: receiveNewPlayer(msg), gameRoomId: msg.gameId, broadcast: false };
      break;
    case 'gameUpdate':
      response = {
        serverMsg: generateGameUpdateMessage(msg),
        gameRoomId: msg.gameId,
        broadcast: true,
      };
      break;
    case 'gameOptions':
      generateGameMessage(msg);
      break;
    case 'gameStart':
      response = { serverMsg: startGame(msg), gameRoomId: msg.gameId, broadcast: true };
      break;
    case 'leaveGame':
      response = { serverMsg: leaveGame(msg), gameRoomId: msg.gameId, broadcast: true };
      break;
    case 'endGame':
      response = { serverMsg: endGame(msg), gameRoomId: msg.gameId, broadcast: true };
      break;
    case 'askForPlayers':
      response = { serverMsg: playersResponse(msg), gameRoomId: msg.gameId, broadcast: true };
      break;
    case 'trapCardUsed':
      response = { serverMsg: trapCardResponseMsg(msg), gameRoomId: msg.gameId, broadcast: true };
      break;
    default:
      break;
  }

  return response;
}

/**
 * Método para analizar y responder mensajes.
 * @param {String} msg Mensaje recibido por sockets.
 */
exports.parseMessages = (msg) => readMessage(msg);
