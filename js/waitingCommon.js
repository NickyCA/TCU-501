/* eslint-disable import/extensions */
import Common from './common.js';

let gameLocalInfo;

/**
 * Incorpora el nombre del jugador en el waiting room
 * @param {string} playerName
 */
function insertPlayersHtml(playerName) {
  const newHtml = `
  <li>
      <h4>${playerName}</h4>
  </li>`;
  return newHtml;
}

/**
 * Redirecciona a la pagina principal
 */
function returnIndex() {
  localStorage.clear();
  window.open('./', '_self');
}

/**
 * Inserta la lista de jugadores en el panel (html) correspondiente del waiting room
 * @param {object} response Contiene la información actualizada desde el servidor de la partida.
 */
function loadPlayers(response) {
  let playersHtml = '';

  if (response.players.length === 0) {
    Common.showCommonError('No data', 'this game no longer exists', returnIndex);
  } else {
    localStorage.setItem('playersInGame', response.players.length.toString());
    for (let ind = 0; ind < response.players.length; ind += 1) {
      playersHtml += insertPlayersHtml(response.players[ind].name);
    }
    if (playersHtml.length > 0) {
      const playersContainer = document.getElementById('players_tag');
      playersContainer.innerHTML = playersHtml;
    }
  }
}

/**
 * Guarda en el local storage las configuraciones seleccionadas para la partida
 * @param {string} msg
 */
function saveGameInit(msg) {
  localStorage.setItem('state', 'startingGame');

  const gameInitialData = JSON.stringify(msg);

  localStorage.setItem('gameInitialData', gameInitialData);

  window.open('./juego', '_self');
}

/**
 * Despliega un mensaje que indica el nombre del jugador que ha abandonado la partida
 * Actualiza su lista de jugadores
 * @param {object} response Contiene la información actualizada desde el servidor de la partida.
 * @param {socket} socket
 */
function playerLeave(response, socket) {
  if (response.playerName !== '') {
    Swal.fire({
      allowOutsideClick: false,
      allowEscapeKey: false,
      position: 'top-end',
      icon: 'info',
      title: `Player ${response.playerName} left the game`,
      showConfirmButton: false,
      timer: 1500,
    });
    const message = {
      messageType: 'askForPlayers',
      gameId: localStorage.getItem('gameId'),
    };
    socket.emit('fromClient', JSON.stringify(message));
  }
}

/**
 * Genera una tabla de posiciones (1er,2do 3er...lugar) respecto a los puntos historicos
 */
function generateGameStats() {
  const playersSorted = [...gameLocalInfo.players];

  let html = '<table id="stats">';
  html += '<tr>';

  // Ordena los jugadores por puntos ganados

  playersSorted.sort(
    (a, b) => (
      ((a.historicPoints < b.historicPoints) ? 1 : -1)
      || ((a.historicRounds < b.historicRounds) ? 1 : -1)),
  );

  html += '<th>Position</th><th>Player</th><th>Points</th><th>Rounds</th>';

  html += '</tr>';

  for (let i = 0; i < playersSorted.length; i += 1) {
    const posicion = i + 1;
    const medalla = `<img src="img/medal${posicion.toString()}.svg" class="medal" />`;
    html += '<tr>';

    html += `<th>${posicion <= 3 ? medalla : posicion}</th>
              <td>${playersSorted[i].name}</td>
              <td>${playersSorted[i].historicPoints}</td>
              <td>${playersSorted[i].historicRounds}</td>`;

    html += '</tr>';
  }

  html += '</table>';

  return html;
}

/**
 * Clase con los metodos comunes entre waiting.js y host.js
 */
export default class WaitingCommon {
  /**
   *Envia un mensaje que solicita la lista de jugadores actualizada
   * @param {socket} socket
   */
  static askForPlayersMessage(socket) {
    const message = {
      messageType: 'askForPlayers',
      gameId: localStorage.getItem('gameId'),
    };
    socket.emit('fromClient', JSON.stringify(message));
  }

  /**
   * Inserta en el html de la sala de espera el id de la partida
   */
  static insertGameId() {
    const gameId = document.getElementById('game_id');
    gameId.innerHTML = `Game ID: ${localStorage.getItem('gameId')}`;
  }

  /**
   * Solicita al servidor que lo una a un room del socket
   * @param {socket} socket
   */
  static joinGameRoom(socket) {
    const gameId = localStorage.getItem('gameId');
    const playerId = localStorage.getItem('playerId');
    console.log(gameId);
    const msg = {
      messageType: 'gameRoomJoin',
      gameId,
      playerId,
    };
    socket.on('connect', () => { socket.emit('gameRoom', JSON.stringify(msg)); });
  }

  /**
   * Acciones a realizar segun los mensajes que reciba del servidor
   * @param {socket} socket
   */
  static messagesListener(socket) {
    socket.on('fromServer', (msg) => {
      console.log(msg);
      const response = JSON.parse(msg);
      switch (response.messageType) {
        case 'initialResponse':
          // loadWaitingRoom(response);
          break;
        case 'error':
          // showError(response);
          break;
        case 'playersResponse':
          loadPlayers(response);
          break;
        case 'game':
          saveGameInit(response);
          break;
        case 'playerLeave':
          playerLeave(response, socket);
          break;
        default:
          break;
      }
    });
  }

  /**
   * Genera un pop up con una tabla de posiciones (1er,2do 3er...lugar)
   * respecto a los puntos historicos
   */
  static showHistoricalStats() {
    const savedGameData = localStorage.getItem('gameInitialData');

    if (savedGameData !== undefined && savedGameData !== '') {
      const game = JSON.parse(savedGameData);
      gameLocalInfo = game;

      if (localStorage.getItem('state') === 'returningToWaitingRoom') {
        const gameStatsHtml = generateGameStats();
        Swal.fire({
          title: 'Historical points',
          html: gameStatsHtml,
          width: 600,
          allowOutsideClick: false,
          allowEscapeKey: false,
          confirmButtonColor: Common.GetBaseColorOne(),
          confirmButtonText: 'OK',
        });
      }
    }
  }
}
