/* eslint-disable no-console */
let objectQuantity = 25; // constante que determina la cantidad de cartas en el tablero

let playerCardQuantity = 5; // cantidad de cartas que debera de buscar el jugador
const baseColorOne = '#f27294';
const baseColorOnergba = 'rgba(242,114,148,0.1)';
const baseColorTwo = '#f2dc6b';
const soundEffectSuccess = document.createElement('audio'); // almacena el sonido de exito
const soundEffectFail = document.createElement('audio'); // almacena el sonido de fallo
const cardSrc = "img/cards/";
const imgArray = ["cat","dog","hipo","lion","monkey","pig"];
const objectTotal = imgArray.length; // cantidad maxima disponible de objetos para el tablero
/*
Regla del equipo:
 en caso de ser true se debe de hacer click en el boton
  basta cuando se hayan  encontrado todas las cartas.
  False indica que el mensaje de gane aparece automaticamente
  (una vez el jugador encuentre todas las cartas)
 */
let stopGameButtonRule = true;


/*
arreglo que almacena los ids de los objetos que actualmente se encuentra en el tablero
*/
let gameBoardObjects = [];

/*
arreglo que almacena todo el html de los objetos que actualmente se encuentra en el tablero
*/
let gameBoardCompleteObjects = [];

/*
arreglo que almacena los ids de las cartas que debera buscar el jugador
*/
let playerCards = [];

/*
arreglo que almacena todo el html de las cartas que debera buscar el jugador
*/
let playerCompleteCards = [];
let puntaje = 0; // variable que almacena el puntaje actual del jugador

/*
 arreglo que almacena las cartas que ya fueron encontradas exitosamente por el jugador
*/
let foundCards = [];

/*
Muestra una notificación de error
*/
function showError(titleText, errorMessage) {
  Swal.fire({
    icon: 'error',
    title: titleText,
    text: errorMessage,
    confirmButtonText: 'Bueno',
    confirmButtonColor: baseColorOne,
    timer: 2000,
    timerProgressBar: true,
  });
}

/*
Actualiza la variables global puntaje
le suma un punta, se llama cada vez que hay un acierto
actualiza el puntaje actual en el html
*/
function actualizarPuntaje() {
  puntaje += 1;
  const vistaPuntaje = document.getElementById('points');
  vistaPuntaje.innerHTML = `<label id="points">${puntaje}</label>`;
}

function actualizarPuntosParaGanar() {
  puntajeActual = playerCardQuantity - puntaje;
  const vistaPuntaje = document.getElementById('round_points_toend');
  vistaPuntaje.innerHTML = `<label id="round_points_toend">${puntajeActual} points left to win</label>`;
}

/*
Reproduce el archivo de sonido identificado como soundEffectSuccess
Se llama cuando hay un acierto
*/
function soundEffectSuccessFun() {
  soundEffectSuccess.play();
}

/*
Reproduce el archivo de sonido identificado como soundEffectFail
Se llama cuando el jugador hace click a una carta incorrecta
*/
function soundEffectFailFun() {
  soundEffectFail.play();
}

/*
 Genera el html de cada objeto para ser incluido en el tablero.
*/
function completeBoardFloraFauna(text) {
  let src = cardSrc+text+".png";
  const newHtml = `<div id="o-${text}" class="grid-item">
  <div class="grid-item-face grid-item-face--front">
  <img src="${src}" class="cardsImgs" />
  </div>
  <div class="grid-item-face grid-item-face--back">
  </div>
  </div>`;
  return newHtml;
}

/*
 Genera el html de cada carta de jugador para ser incluido en la sección lateral.
*/
function completePlayerCards(text) {
  const newHtml = `<div id="c-${text}" class="grid-item-player">${text}</div>`;
  return newHtml;
}

/*
Coloca el nuevo html de objetos en la página.
*/
function drawBoardObjects(newHtml) {
  const objectsContainer = document.getElementById('objects-container');

  objectsContainer.innerHTML = newHtml;
}

/*
Coloca el nuevo html de cartas en la página.
*/
function drawPlayerCards(newHtml) {
  const cardsContainer = document.getElementById('player-cards');

  cardsContainer.innerHTML = newHtml;
}

function gameFloraFaunaGenerator() {
  // Limpia las cartas encontradas.
  foundCards = [];

  const randomObjects = imgArray.sort(() => 0.5 - Math.random()).slice(0, objectQuantity);
  console.log(randomObjects);

  // Obtiene los ids de los objetos.
  gameBoardObjects = randomObjects.map((val) => String(val).padStart(3, '0'));
  console.log("gameBoardObjects",gameBoardObjects);

  // Completa la información html de los objetos.
  gameBoardCompleteObjects = gameBoardObjects.map((val) => completeBoardFloraFauna(val));
  console.log("html de los objetos",gameBoardCompleteObjects);
  // Obtiene las cartas del jugador.
  playerCards = gameBoardObjects.sort(() => 0.5 - Math.random()).slice(0, playerCardQuantity);
  console.log("playerCardQuantity",playerCardQuantity);
  // Completa la información html de las cartas de jugador.
  playerCompleteCards = playerCards.map((val) => completePlayerCards(val));
  console.log("html de las cartas de jugador",playerCompleteCards);
  // Inserta el nuevo html de objetos en la página.
  drawBoardObjects(gameBoardCompleteObjects.join(''));

  // Inserta el nuevo html de cartas de jugador en la página.
  drawPlayerCards(playerCompleteCards.join(''));

  // Eventos para comprobar el juego.
  // Mas adelante se cambiara por objetos
  // checkClickedItem();
}

/*
Genera el mensaje cuando se gana la partida y carga un gif como parte del efecto
*/
function showWinner() {
  Swal.fire({
    title: '¡Felicidades ha ganado la partida!',
    width: 600,
    confirmButtonColor: baseColorOne,
    padding: '3em',
    backdrop: `
      ${baseColorOnergba}
      url("./img/6ob.gif")
      center
      repeat
    `,
    willClose: () => {
      gameFloraFaunaGenerator();
    },
  });
}

/*
Las tarjetas a buscar (se encuentran en el panel lateral) se vuelven mas transparentes
cuando ya han sido encontradas, esto para que el jugador no tenga
que recordar cuales cartas ya encontró
*/
function changeFoundsColor(id) {
  let cardId = 'c-';
  cardId = cardId.concat(id);
  const found = document.getElementById(cardId);
  found.classList.add('gray');
}


function changeFoundImgColor(id) {
  let cardId = 'o-';
  cardId = cardId.concat(id);
  const found = document.getElementById(cardId);
  found.classList.add('foundImg');
}
/*
Recibe el id del objeto que fue clickeado en el tablero
Revisa si este objeto era parte de las cartas que el jugador debia buscar
de ser un acierto, guarda en un arreglo la carta encontrada, reproduce el sonido de acierto,
actualiza el puntaje y marca la su carta como encontrada (la vuelve mas transparente)

En caso de que ya todas la cartas fueron encontradas y la regla de basta este desactivada
entonces muestre el mensaje que ha ganado

En caso de que se le hizo click a la carta incorrecta, se reproduce el sonido de error
y se activa la animacion de "shake" de la carta clickeada para denotar que es
incoorrecta.
*/
function matchClicked(gridItemId) {
  const id = gridItemId.substring(2, gridItemId.length);
  console.log("id:",id);
  console.log("gridItemId:",gridItemId);
  const obj = document.getElementById(gridItemId);

  if (playerCards.includes(id) === true) {
    if (foundCards.includes(id) === false) {
      //obj.classList.toggle('is-flipped');
      changeFoundImgColor(id);
      foundCards.push(id);
      soundEffectSuccessFun();
      actualizarPuntaje();
      actualizarPuntosParaGanar();
      changeFoundsColor(id);
    }

  console.log(foundCards.length == playerCardQuantity);
    if (foundCards.length == playerCardQuantity) {
      if (stopGameButtonRule === "false") {
        showWinner();
      }
    }
  } else {
    obj.classList.toggle('wrong');
    soundEffectFailFun();
    setTimeout(() => { obj.classList.remove('wrong'); }, 1000);
  }
}

/*
Muestra un mensaje de confirmación antes de abandonar el juego.
 */
function exitConfirm() {
  Swal.fire({
      title: 'Leave game?',
      text: 'Returning to main screen',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: baseColorOne,
      cancelButtonColor: baseColorTwo,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      focusCancel: true,
  }).then((result) => {
      if (result.isConfirmed) {
      Swal.fire({
          title: 'Leaving game',
          text: 'Bye bye!',
          imageUrl: 'https://i.imgflip.com/44360m.jpg',
          timer: 2000,
          timerProgressBar: true,
          confirmButtonText: 'OK',
          confirmButtonColor: baseColorOne,
          willClose: () => {
  
          localStorage.clear();
          window.open('./index.xhtml', '_self');
          },
      });
      }
  });
  }

/*
Funcion asociada al boton Basta
Regla del equipo: en caso de haber sido elegida la opcion, el
jugdor debera hacer click en el boton basta para indicar que ya termino su busqueda
(encontro todas sus cartas asignadas), es decir, no se mostrara el mensaje automaticamente

Comprueba si verdadderamente el jugador ha encontrado todas las cartas
de ser asi muestra el mensaje "ganador" en caso contrario muestra un mensaje de error
*/
function checkWinner() {
  console.log(foundCards.length);
  console.log("here checkwinner");
  if (foundCards.length == playerCardQuantity) {
    showWinner();
  } else {
    showError('Error', 'Ud no ha ganado.');
  }
}

/*
Añade los eventos a los botones.
*/
function addEvents() {
  // Agregar evento al botón de abandonar
  const leave = document.getElementById('leave');
  leave.addEventListener('click', exitConfirm);

  // Agregar evento al botón basta
  const stop = document.getElementById('stop');
  stop.addEventListener('click', checkWinner);

  const objectsContainer = document.getElementById('objects-container');

  objectsContainer.addEventListener('click', (e) => {
    let id;
    if (e.target.nodeName === 'img' && e.target.parentNode.parentNode.classList.contains('grid-item') === true) {
      id = e.target.parentNode.parentNode.id;
    } else if (e.target.nodeName === 'div' && e.target.parentNode.classList.contains('grid-item') === true) {
      id = e.target.parentNode.id;
    }
    console.log("ID:",id);
    if (id) {
      matchClicked(id);
    }
  });
}

function insertPlayersHtml() {
  const newHtml = `
  <h3>${localStorage.getItem('playerName')}</h3>
  `;

  const playersContainer = document.getElementById('player_tag');
  playersContainer.innerHTML = newHtml;
}



/*
Carga los archivos de audio y los asocia a las variables
soundEffectSuccess y soundEffectFail respectivamente.
*/
function addSounds() {
  soundEffectSuccess.src = 'js/sound/success.ogg';
  soundEffectFail.src = 'js/sound/fail.ogg';
}


function closingCode(){
  localStorage.clear();
   return null;
}

/*
Función inicial.
*/
function init() {
 objectQuantity = localStorage.getItem('objectsQuantity'); // constante que determina la cantidad de cartas en el tablero
 playerCardQuantity = localStorage.getItem('playersCardsQuantity'); // cantidad de cartas que debera de buscar el jugador
 stopGameButtonRule = localStorage.getItem('stopButton'); 
 insertPlayersHtml();
  addEvents(); // agrega los eventos
  addSounds(); // carga los sonidos

  // Generar cartas
  console.log("playerCardQuantity",playerCardQuantity);
  //gameObjectsGenerator();
  gameFloraFaunaGenerator();
}

// Espera a que se cargue la pagina para iniciar la funcion de init
window.addEventListener('load', init);
window.onbeforeunload = closingCode;
