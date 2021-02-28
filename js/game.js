/* eslint-disable import/extensions */
/* eslint-disable no-console */
import Common from './common.js';

const socket = io();
const soundEffectSuccess = document.createElement('audio'); // almacena el sonido de exito
const soundEffectFail = document.createElement('audio'); // almacena el sonido de fallo

/**
 * Colores para las cartas en el tablero:
 */
const colors = ['#32d6d6', 'black', 'blue', 'fuchsia', '#519fff', 'green',
  'lime', '#ff6d35', 'navy', '#c879f9', 'orange', 'purple', 'red',
  '#808fff', 'teal', '#f8e86a'];

/**
 * arreglo que almacena los ids de los objetos que actualmente se encuentra en el tablero
 */
let gameBoardObjects = [];

/**
 * Arreglo que almacena todo el html de los objetos que actualmente se encuentra en el tablero
 */
let gameBoardCompleteObjects = [];

/**
 * Arreglo que almacena los ids de las cartas que debera buscar el jugador
 */
let playerCards = [];

/**
 * Arreglo que almacena todo el html de las cartas que debera buscar el jugador
 */
let playerCompleteCards = [];

/**
 * Arreglo que almacena las cartas que ya fueron encontradas exitosamente por el jugador
 */
let foundCards = [];

/**
 * Almacena la información local de la partida y se mantiene actualizada.
 */
let gameLocalInfo;

/**
 * Reproduce el archivo de sonido identificado como soundEffectSuccess
 * Se llama cuando hay un acierto
 */
function soundEffectSuccessFun() {
  soundEffectSuccess.play();
}

/**
 * Reproduce el archivo de sonido identificado como soundEffectFail
 * Se llama cuando el jugador hace click a una carta incorrecta
 */
function soundEffectFailFun() {
  soundEffectFail.play();
}

/**
 * Genera el HTML de cada objeto para ser incluido en el tablero.
 * @param {String} text Id de la carta que se dibujará en el tablero.
 *
 * @returns {String} Código HTML con la información la carta en el tablero.
 */
function completeBoardObjects(text) {
  const objectColor = colors[Math.floor(Math.random() * colors.length)];
  const newHtml = `<div id="o-${text}" class="grid-item">
  <div class="grid-item-face grid-item-face--front">
    <label class="icon-${text}" style="color:${objectColor}"/>
  </div>
  <div class="grid-item-face grid-item-face--back">
  </div>
  </div>`;

  return newHtml;
}

/**
 * Genera el html de cada carta de jugador para ser incluido en la sección lateral.
 * @param {String} text Id de la carta de los jugadores.
 *
 * @returns {String} Código HTML con la infromación de las cartas del jugador.
 */
function completePlayerCards(text) {
  const newHtml = `<div id="c-${text}" class="grid-item-player"><label class="icon-${text}"/></div>`;

  return newHtml;
}

/**
 * Coloca el nuevo html de objetos en la página.
 * @param {String} newHtml Código HTML con los objetos del tablero.
 */
function drawBoardObjects(newHtml) {
  const objectsContainer = document.getElementById('objects-container');

  objectsContainer.innerHTML = newHtml;
}

/**
 * Coloca el nuevo html de cartas en la página.
 * @param {String} newHtml Código HTML generado con la información
 * de las cartas de los otros jugadores.
 */
function drawPlayerCards(newHtml) {
  const cardsContainer = document.getElementById('player-cards');

  cardsContainer.innerHTML = newHtml;
}

/**
 * Genera el código html con los datos de cada jugador.
 * @param {String} playerName Nombre del jugador.
 * @param {String} playerId Id del jugador.
 * @param {Number} points Puntos del jugador.
 * @param {Number} rounds Rondas del jugador.
 * @param {String} cardsHtml Código html de las cartas del jugador.
 *
 * @returns {String} Retorna el código HTML.
 */
function insertPlayersHtml(playerName, playerId, points, rounds, cardsHtml) {
  const id = `player-${playerId}`;
  const pointsId = `${playerId}_points`;
  const roundsId = `${playerId}_rounds`;
  const newHtml = `
  <div id="${id}-player-div" class="players-cards-container">
    <section id="${id}-section">
      <div class="points-info">
        <h4>${playerName}</h4>
        <label id="${pointsId}" class="counters">Puntos: ${points}</label>
        <label id="${roundsId}" class="counters">Rondas: ${rounds}</label>
      </div>
      <div class="container">
        <div id="${id}" class="grid-row">
        ${cardsHtml}
        </div>
      </div>
    </section>
  </div>`;

  return newHtml;
}

/**
 * Genera los objetos y cartas de jugador.
 * @param {Object} gameBoardObjectsFromServer Objetos del tablero, generados en el servidor.
 * @param {Object} playerCardsFromServer Cartas de los jugadores, generadas en el servidor.
 */
function gameObjectsGenerator(gameBoardObjectsFromServer, playerCardsFromServer) {
  // Limpia las cartas encontradas.
  foundCards = [];
  gameBoardObjects = gameBoardObjectsFromServer;
  playerCards = playerCardsFromServer;

  // Completa la información html de los objetos.
  gameBoardCompleteObjects = gameBoardObjects.map((val) => completeBoardObjects(val));

  // Completa la información html de las cartas de jugador.
  playerCompleteCards = playerCards.map((val) => completePlayerCards(val));

  // Inserta el nuevo html de objetos en la página.
  drawBoardObjects(gameBoardCompleteObjects.join(''));

  // Inserta el nuevo html de cartas de jugador en la página.
  drawPlayerCards(playerCompleteCards.join(''));
}

/**
 * Limpia los objetos del juego.
 */
function clearGame() {
  localStorage.clear();
  gameBoardObjects = [];
  playerCards = [];
  playerCompleteCards = [];
  gameBoardCompleteObjects = [];
}

/**
 * Genera un mensaje con las estadísticas de la partida.
 *
 * @returns Código HTML con las estádisticas de la partida.
 */
function generateGameStats() {
  const playersSorted = [...gameLocalInfo.players];
  const { gameType } = gameLocalInfo.options;

  let html = '<table id="stats">';
  html += '<tr>';

  // Ordena los jugadores por puntos ganados
  if (gameType === 1) {
    playersSorted.sort((a, b) => ((a.points < b.points || a.rounds < b.rounds) ? 1 : -1));
    html += '<th>Posición</th><th>Jugador</th><th>Puntos</th><th>Rondas</th>';
    // Ordena los jugadores por rondas ganadas
  } else if (gameType === 2) {
    playersSorted.sort((a, b) => ((a.rounds < b.rounds || a.points < b.points) ? 1 : -1));
    html += '<th>Posición</th><th>Jugador</th><th>Rondas</th><th>Puntos</th>';
  }

  html += '</tr>';

  for (let i = 0; i < playersSorted.length; i += 1) {
    const posicion = i + 1;
    const medalla = `<img src="img/medal${posicion.toString()}.svg" class="medal" />`;
    html += '<tr>';

    if (gameType === 1) {
      html += `<th>${posicion <= 3 ? medalla : posicion}</th>
               <td>${playersSorted[i].name}</td>
               <td>${playersSorted[i].points}</td>
               <td>${playersSorted[i].rounds}</td>`;
    } else if (gameType === 2) {
      html += `<th>${posicion <= 3 ? medalla : posicion}</th>
               <td>${playersSorted[i].name}</td>
               <td>${playersSorted[i].rounds}</td>
               <td>${playersSorted[i].points}</td>`;
    }

    html += '</tr>';
  }

  html += '</table>';

  return html;
}

/**
 * Genera el mensaje cuando se gana la partida y carga un gif como parte del efecto
 */
function showWinner() {
  const gameStatsHtml = generateGameStats();
  Swal.fire({
    title: '¡Felicidades has ganado la partida!',
    html: gameStatsHtml,
    width: 600,
    allowOutsideClick: false,
    allowEscapeKey: false,
    confirmButtonColor: Common.GetBaseColorOne(),
    confirmButtonText: 'Bueno',
    timer: 60000,
    timerProgressBar: true,
    padding: '3em',
    backdrop: `
      ${Common.GetBaseColorOnergba()}
      url("./img/6ob.gif")
      center
      repeat
    `,
    willClose: () => {
      const host = localStorage.getItem('host');
      let waitingRoom = './salaespera';
      if (host === 'true') {
        waitingRoom = './salaanfitrion';
      }
      localStorage.setItem('state', 'returningToWaitingRoom');
      localStorage.setItem('gameInitialData', JSON.stringify(gameLocalInfo));
      window.location.replace(waitingRoom);
    },
  });
}

/**
 * Muestra un mensaje del jugador que perdió
 * y le muestra el nombre del jugador que ganó.
 * @param {string} winnerName Nombre del ganador.
 */
function showLoser(winnerName) {
  const gameStatsHtml = generateGameStats();
  Swal.fire({
    title: `¡ :'( Has perdido! Ha ganado ${winnerName}`,
    html: gameStatsHtml,
    width: 600,
    allowOutsideClick: false,
    allowEscapeKey: false,
    confirmButtonColor: Common.GetBaseColorOne(),
    confirmButtonText: 'Bueno',
    timer: 60000,
    timerProgressBar: true,
    padding: '3em',
    backdrop: `
      ${Common.GetBaseColorGrayrgba()}
      url("./img/ZN2f.gif")
      center
      repeat
    `,
    willClose: () => {
      const host = localStorage.getItem('host');
      let waitingRoom = './salaespera';
      if (host === 'true') {
        waitingRoom = './salaanfitrion';
      }
      localStorage.setItem('state', 'returningToWaitingRoom');
      localStorage.setItem('gameInitialData', JSON.stringify(gameLocalInfo));
      window.location.replace(waitingRoom);
    },
  });
}

/**
 * Las tarjetas a buscar (se encuentran en el panel lateral) se vuelven mas transparentes
 * cuando ya han sido encontradas, esto para que el jugador no tenga
 * que recordar cuales cartas ya encontró
 * @param {String} id Id de la carta del jugador.
 */
function changeFoundsColor(id) {
  let cardId = 'c-';
  cardId = cardId.concat(id);
  const found = document.getElementById(cardId);
  found.classList.add('gray');
}

/**
 * Genera un mensaje para avisar al servidor si se debe actualizar el estado
 * de una carta en el tablero.
 * @param {Boolean} stop Indica si se presionó o no el botón de stop.
 * @param {String} foundCard Id de la carta.
 *
 * @returns {String} Mensaje de tipo gameUpdate para el servidor.
 */
function generateGameUpdateMessage(stop, foundCard) {
  const message = {
    messageType: 'gameUpdate',
    gameId: localStorage.getItem('gameId'),
    playerId: localStorage.getItem('playerId'),
    cardId: foundCard,
    stopPressed: stop,
  };
  return JSON.stringify(message);
}

/**
 * Genera el mensaje para utilizar la carta trampa.
 * @param {String} card Id de la carta.
 *
 * @returns {String} Mensaje para el servidor.
 */
function generateTrapCardMsg(card) {
  const message = {
    messageType: 'trapCardUsed',
    gameId: localStorage.getItem('gameId'),
    playerId: localStorage.getItem('playerId'),
    cardId: card,
  };

  return JSON.stringify(message);
}

/**
 * Comprueba las acciones a realizar si se selecciona una carta
 * de un contrincante.
 * @param {String} id Id de la carta seleccionada.
 *
 * @returns {Boolean} Verdadero si puede utilizar la carta trampa, Falso
 * en caso contrario.
 */
function checkTrapCardClicked(id) {
  let result = false;

  if (gameLocalInfo !== undefined) {
    // Verifica si la opción de carta trampa está habilitada.
    const playerData = gameLocalInfo.players.find(
      (player) => player.playerId === localStorage.getItem('playerId'),
    );
    if (gameLocalInfo.options.trapCard > 0 && playerData.trapCardUsed === false) {
      // Verifica que la carta pertenezca a otro jugador
      for (let i = 0; i < gameLocalInfo.players.length; i += 1) {
        if (gameLocalInfo.players[i].cards.includes(id) === true
          && gameLocalInfo.players[i].foundCards.includes(id) === false
          && gameLocalInfo.players[i].playerId !== localStorage.getItem('playerId')) {
          result = true;
          break;
        }
      }
    }
  }

  return result;
}

/**
 * Recibe el id del objeto que fue clickeado en el tablero
 * Revisa si este objeto era parte de las cartas que el jugador debia buscar
 * de ser un acierto, guarda en un arreglo la carta encontrada, reproduce el sonido de acierto,
 * actualiza el puntaje y marca la su carta como encontrada (la vuelve mas transparente)
 *
 * En caso de que ya todas la cartas fueron encontradas y la regla de basta este desactivada
 * entonces muestre el mensaje que ha ganado
 *
 * En caso de que se le hizo click a la carta incorrecta, se reproduce el sonido de error
 * y se activa la animacion de "shake" de la carta clickeada para denotar que es
 * incoorrecta.
 * @param {String} gridItemId Id de la carta a la que se le hizo clic.
 */
function matchClicked(gridItemId) {
  const id = gridItemId.substring(2, 5);
  const obj = document.getElementById(gridItemId);

  if (playerCards.includes(id) === true) {
    if (foundCards.includes(id) === false) {
      obj.classList.toggle('is-flipped');
      foundCards.push(id);
      soundEffectSuccessFun();
      changeFoundsColor(id);
      socket.emit('fromClient', generateGameUpdateMessage(false, id));
    }
  } else if (checkTrapCardClicked(id) === true) {
    // Preguntar si está habilitada la carta trampa
    // Comprobar si es de otro jugador
    // Enviar mensaje
    socket.emit('fromClient', generateTrapCardMsg(id));
    console.log('Hola');
  } else {
    obj.classList.toggle('wrong');
    soundEffectFailFun();
    setTimeout(() => { obj.classList.remove('wrong'); }, 1000);
  }
}

/**
 * Funcion asociada al boton Basta
 * Regla del equipo: en caso de haber sido elegida la opcion, el
 * jugdor debera hacer click en el boton basta para indicar que ya termino su busqueda
 * (encontro todas sus cartas asignadas), es decir, no se mostrara el mensaje automaticamente
 *
 * Comprueba si verdadderamente el jugador ha encontrado todas las cartas
 * de ser asi muestra el mensaje "ganador" en caso contrario muestra un mensaje de error
 */
function checkWinner() {
  socket.emit('fromClient', generateGameUpdateMessage(true, ''));
  if (foundCards.length !== playerCards.length) {
    Common.showCommonError('Stop presionado', 'Usted aún no ha ganado');
  }
}

/**
 * Añade los eventos a los botones.
 */
function addEvents() {
  // Agregar evento al botón de abandonar
  const leave = document.getElementById('leave');
  leave.addEventListener('click', () => { Common.exitConfirm(socket); });

  // Agregar evento al botón basta
  const stop = document.getElementById('stop');
  stop.addEventListener('click', checkWinner);

  // Agregar evento al botón de ayuda
  const help = document.getElementById('help-img-button');
  help.addEventListener('click', Common.showHelp);

  // Obtiene el contenedor de objetos.
  const objectsContainer = document.getElementById('objects-container');

  // Para cada objeto el contenedor le asigna un evento.
  objectsContainer.addEventListener('click', (e) => {
    let id;
    if (e.target.nodeName.toLowerCase() === 'label' && e.target.parentNode.parentNode.classList.contains('grid-item') === true) {
      id = e.target.parentNode.parentNode.id;
    } else if (e.target.nodeName.toLowerCase() === 'div' && e.target.parentNode.classList.contains('grid-item') === true) {
      id = e.target.parentNode.id;
    }

    if (id) {
      const object = document.getElementById(id);
      if (!(object.classList.contains('is-flipped'))) {
        matchClicked(id);
      }
    }
  });
}

/**
 * Carga los archivos de audio y los asocia a las variables
 * soundEffectSuccess y soundEffectFail respectivamente.
 */
function addSounds() {
  soundEffectSuccess.src = 'js/sound/success.ogg';
  soundEffectFail.src = 'js/sound/fail.ogg';
}

/**
 * Completa la información del jugador en pantalla.
 */
function completePlayerInfo() {
  const myName = document.getElementById('my_info_name');
  const gameId = document.getElementById('game_id');

  myName.innerHTML = localStorage.getItem('playerName');
  gameId.innerHTML = `Partida - ${localStorage.getItem('gameId')}`;
}

/**
 * Inicia un evento de conectarse al servidor.
 */
function connect() {
  completePlayerInfo();
}

/**
 * Evalua el mensaje cuando un jugador abandona la partida.
 * @param {Object} response Mensaje del servidor con la información del jugador que abandonó.
 */
function playerLeave(response) {
  if (response.playerName !== '') {
    Swal.fire({
      allowOutsideClick: false,
      allowEscapeKey: false,
      position: 'top-end',
      icon: 'info',
      title: `El jugador ${response.playerName} abandonó la partida.`,
      showConfirmButton: false,
      timer: 1500,
    });

    if (localStorage.getItem('gameId') !== undefined
      && localStorage.getItem('gameId') !== null
      && localStorage.getItem('gameId') !== '') {
      socket.emit('fromClient', generateGameUpdateMessage(false, ''));
    }
  }
}

/**
 * Almacena localmente la información del jugador.
 * @param {Object} response Mensaje con los datos del jugador.
 */
function savePlayerData(response) {
  localStorage.setItem('playerId', response.playerId);
  localStorage.setItem('gameId', response.gameId);

  completePlayerInfo();
}

/**
 * Genera el código HTML con la información de un jugador.
 * @param {Object} playerInfo Información del jugador.
 *
 * @returns {String} Código HTML con la información del jugador.
 */
function generatePlayersInfo(playerInfo) {
  const cardsHtml = playerInfo.cards.map((val) => completePlayerCards(val));
  const playersHtml = insertPlayersHtml(
    playerInfo.name, playerInfo.playerId, playerInfo.points, playerInfo.rounds,
    cardsHtml.join(''),
  );

  return playersHtml;
}

/**
 * Actualiza la información del jugador en el documento HTML.
 * @param {String} playersHtml Código HTML con la información del jugador.
 */
function updatePlayersInfo(playersHtml) {
  const playersContainer = document.getElementById('players_game_info');

  playersContainer.innerHTML = playersHtml;
}

/**
 * Comprueba si hay que mostrar o no la carta trampa en el documento HTML,
 * y en caso de que sea necesario la muestra activada o desactivada.
 */
function displayTrapCard() {
  const playerId = localStorage.getItem('playerId');
  const trapCardImg = document.getElementById('trapCardImg');
  if (gameLocalInfo !== undefined || gameLocalInfo !== null) {
    if (gameLocalInfo.options.trapCard > 0) {
      trapCardImg.style.display = 'block';
      const playerData = gameLocalInfo.players.find((player) => player.playerId === playerId);
      if (playerData.trapCardUsed === true) {
        trapCardImg.src = 'img/trapUsed.svg';
      } else {
        trapCardImg.src = 'img/trap.svg';
      }
    } else {
      trapCardImg.style.display = 'none';
    }
  }
}

/**
 * Ordena los jugadores contrincantes para ver cual tiene más puntos.
 */
function sortPlayers() {
  const playersSorted = [...gameLocalInfo.players];

  // Ordena los jugadores por puntos
  playersSorted.sort((a, b) => ((a.points < b.points) ? 1 : -1));

  for (let i = playersSorted.length - 1; i >= 0; i -= 1) {
    const id = playersSorted[i].playerId;
    const playerDiv = document.getElementById(`player-${id}-player-div`);

    if (playerDiv && playersSorted[i].points > 0) {
      if (i === 0) {
        if (playerDiv.classList.contains('onTop') === false) {
          playerDiv.classList.add('onTop');
          playerDiv.classList.toggle('top');
          setTimeout(() => { playerDiv.classList.remove('top'); }, 1000);
          console.log('Subió de posición.');
        }
      } else {
        playerDiv.classList.remove('onTop');
      }

      playerDiv.style.order = i;
    }
  }
}

/**
 * Inicializa los objetos del juego.
 * @param {Object} response Datos del juego, objetos del tablero, opciones y jugadores.
 */
function initCards(response) {
  let player;
  let playersHtml = '';
  // Configura en pantalla el tipo de juego y los puntos.
  const gameType = document.getElementById('game_type');
  const gamePoints = document.getElementById('round_points_toend');
  if (response.messageType === 'game') {
    const botonStop = document.getElementById('stop');
    if (response.options.stopButton === true) {
      botonStop.style.display = 'block';
    } else {
      botonStop.style.display = 'none';
    }
    if (response.options.gameType === 1) {
      gameType.innerText = 'Juego por Puntos';
      gamePoints.innerText = `Puntos para ganar: ${response.options.points}`;
    } else if (response.options.gameType === 2) {
      gameType.innerText = 'Juego por Rondas';
      gamePoints.innerText = `Rondas para ganar: ${response.options.rounds}`;
    }

    gameLocalInfo = response;
  } else {
    gameLocalInfo.board = response.board;
    gameLocalInfo.players = response.players;
  }

  displayTrapCard();
  for (let ind = 0; ind < response.players.length; ind += 1) {
    player = response.players[ind].playerId;
    if (player === localStorage.getItem('playerId')) {
      gameObjectsGenerator(response.board, response.players[ind].cards);
    } else {
      playersHtml += generatePlayersInfo(response.players[ind]);
    }
  }

  updatePlayersInfo(playersHtml);

  sortPlayers();
}

/**
 * Actualiza el puntaje del jugador.
 * @param {String} playerId Id del jugador.
 * @param {Number} point Cantidad de puntos.
 * @param {Number} rounds Cantidad de rondas.
 */
function updatePlayersScore(playerId, point, rounds) {
  let idPoints;
  let idRounds;
  if (playerId === localStorage.getItem('playerId')) {
    idPoints = 'my_points';
    idRounds = 'my_rounds';
  } else {
    idPoints = `${playerId}_points`;
    idRounds = `${playerId}_rounds`;
  }

  const vistaPuntaje = document.getElementById(idPoints);
  vistaPuntaje.innerHTML = `Puntos: ${point}`;
  const vistaRondas = document.getElementById(idRounds);
  vistaRondas.innerHTML = `Rondas: ${rounds}`;
}

/**
 * Reconfigura el juego y actualiza la información.
 * @param {Object} response Contiene la información actualizada del juego.
 */
function resetCards(response) {
  let timerInterval;
  let messageForPlayers = '';

  for (let ind = 0; ind < response.players.length; ind += 1) {
    updatePlayersScore(
      response.players[ind].playerId,
      response.players[ind].points,
      response.players[ind].rounds,
    );
  }

  sortPlayers();

  if (response.winnerId === localStorage.getItem('playerId')) {
    messageForPlayers = '¡Has ganado la ronda!';
  } else if (response.winnerId !== '') {
    const winnerName = response.players.find((p) => p.playerId === response.winnerId).name;
    messageForPlayers = `Ha ganado la ronda ${winnerName}`;
  }

  Swal.fire({
    title: messageForPlayers,
    html: 'La siguiente ronda iniciará en <b></b> segundos',
    timer: 5000,
    timerProgressBar: true,
    allowOutsideClick: false,
    allowEscapeKey: false,
    showCancelButton: false,
    showConfirmButton: false,
    willOpen: () => {
      Swal.showLoading();
      timerInterval = setInterval(() => {
        const content = Swal.getContent();
        if (content) {
          const b = content.querySelector('b');
          if (b) {
            b.textContent = parseInt(Swal.getTimerLeft() / 1000, 10);
          }
        }
      }, 100);
    },
    willClose: () => {
      clearInterval(timerInterval);
    },
  }).then((result) => {
    if (result.dismiss === Swal.DismissReason.timer) {
      initCards(response);
    }
  });
}

/**
 * Actualiza el juego con datos desde el servidor.
 * @param {Object} response Contiene la información actualizada desde el servidor de la partida.
 */
function gameUpdate(response) {
  gameLocalInfo.players = response.players;

  if (response.winnerId === localStorage.getItem('playerId')) {
    showWinner();
  } else if (response.winnerId !== '') {
    const winnerName = response.players.find((p) => p.playerId === response.winnerId).name;
    showLoser(winnerName);
  }

  const otherPlayers = response.players.filter((player) => player.playerId !== localStorage.getItem('playerId'));
  const playersHtml = otherPlayers.map((player) => generatePlayersInfo(player)).join('');

  updatePlayersInfo(playersHtml);

  for (let ind = 0; ind < response.players.length; ind += 1) {
    // Para actualizar la info de los jugadores.
    response.players[ind].foundCards.forEach((element) => {
      changeFoundsColor(element);
      const id = `o-${element}`;
      const obj = document.getElementById(id);
      console.log(id);
      obj.classList.toggle('is-flipped', true);
    });

    updatePlayersScore(
      response.players[ind].playerId,
      response.players[ind].points,
      response.players[ind].rounds,
    );
  }

  sortPlayers();
}

function trapCard(response) {
  const id = `o-${response.cardId}`;
  const obj = document.getElementById(id);
  if (response.correctCard === true) {
    obj.classList.toggle('is-flipped', true);
    setTimeout(() => { obj.classList.remove('is-flipped'); }, (gameLocalInfo.options.trapCard * 1000));
    if (response.playerId === localStorage.getItem('playerId')) {
      const playerData = gameLocalInfo.players.find(
        (player) => player.playerId === response.playerId,
      );
      playerData.trapCardUsed = true;
      displayTrapCard();
    }
  } else if (response.playerId === localStorage.getItem('playerId')) {
    obj.classList.toggle('wrong');
    setTimeout(() => { obj.classList.remove('wrong'); }, 1000);
  }
}

/**
 * Escucha y analiza los mensajes que llegan desde el servidor.
 */
function messagesListener() {
  socket.on('fromServer', (msg) => {
    console.log(msg);
    const response = JSON.parse(msg);
    switch (response.messageType) {
      case 'initialResponse':
        savePlayerData(response);
        break;
      case 'game':
        initCards(response);
        break;
      case 'gameReset':
        resetCards(response);
        break;
      case 'gameUpdateServer':
        gameUpdate(response);
        break;
      case 'playerLeave':
        playerLeave(response);
        break;
      case 'endGameResponse':
        clearGame();
        break;
      case 'trapCardResponse':
        trapCard(response);
        break;
      default:
        break;
    }
  });
}

/**
 * Comprueba la información local del juego y si existe la carga en pantalla.
 */
function checkSavedInitialGameData() {
  const savedGameData = localStorage.getItem('gameInitialData');

  if (savedGameData !== undefined && savedGameData !== '') {
    const game = JSON.parse(savedGameData);
    gameLocalInfo = game;
    initCards(game);
  }
}

/**
 * Crea un mensaje para unirse a una sala de los sockets, la que le corresponda por GameId.
 */
function joinGameRoom() {
  const gameId = localStorage.getItem('gameId');
  const playerId = localStorage.getItem('playerId');
  console.log(gameId);
  const msg = {
    messageType: 'gameRoomJoin',
    gameId,
    playerId,
  };

  localStorage.setItem('state', 'playing');

  socket.on('connect', () => { socket.emit('gameRoom', JSON.stringify(msg)); });
}

/**
 * Comprueba si debe redireccionar al jugador a la pantalla inicial.
 */
function checkIfRedirect() {
  const gameid = localStorage.getItem('gameId');
  if (gameid === null) {
    window.open('/', '_self');
  }
}

/**
 * Método adicional para anunciarse en el servidor.
 * Sirve para asegurarse de que está bien conectado.
 */
function announce() {
  const gameId = localStorage.getItem('gameId');
  const playerId = localStorage.getItem('playerId');
  console.log('announce ', gameId);
  const msg = {
    messageType: 'announce',
    gameId,
    playerId,
  };
  socket.emit('fromClient', JSON.stringify(msg));
}

/**
 * Función inicial.
 */
function init() {
  checkIfRedirect(); // Comprueba si se debe redireccionar a la página inicial.
  joinGameRoom(); // Se una a la sala del juego.
  checkSavedInitialGameData(); // Revisa si hay datos iniciales del juego desde la sala de espera.
  messagesListener(); // Escucha los mensajes.
  connect(); // Se conecta con el servidor.
  addEvents(); // Agrega los eventos.
  addSounds(); // Carga los sonidos.
  displayTrapCard(); // Muestra si es necesario la carta trampa.
  announce(); // Se anuncia en el juego para comprobar que está conectado.
}

// Espera a que se cargue la pagina para iniciar la funcion de init
window.addEventListener('load', init);
