/* eslint-disable no-console */
let objectQuantity = 25; // constante que determina la cantidad de cartas en el tablero

let playerCardQuantity = 5; // cantidad de cartas que debera de buscar el jugador
const baseColorOne = '#f27294';
const baseColorOnergba = 'rgba(242,114,148,0.1)';
const baseColorTwo = '#f2dc6b';
const soundEffectSuccess = document.createElement('audio'); // almacena el sonido de exito
const soundEffectFail = document.createElement('audio'); // almacena el sonido de fallo
const cardSrc = "img/cards/new/";

let bear =  document.createElement('audio');
let bunnies =  document.createElement('audio');
let cat =  document.createElement('audio');
let alligator =  document.createElement('audio');
let deer =  document.createElement('audio');
let dog =  document.createElement('audio');
let elephant =  document.createElement('audio');
let fox =  document.createElement('audio');
let frogs =  document.createElement('audio');
let giraffe =  document.createElement('audio');
let jellyfish =  document.createElement('audio');
let kangaroo =  document.createElement('audio');
let lion =  document.createElement('audio');
let monkey =  document.createElement('audio');
let piggies =  document.createElement('audio');
let octopus =  document.createElement('audio');
let sheep =  document.createElement('audio');
let turtle =  document.createElement('audio');
let whale =  document.createElement('audio');
let zebra =  document.createElement('audio');
const soundArray = [bear, bunnies, cat, alligator, deer, dog, elephant, fox, frogs, giraffe, jellyfish, kangaroo, lion, monkey, piggies, octopus, sheep, turtle, whale, zebra];

const imgArray = ["Bear","Bunnies","Cat","Cocodrilo","Deer","Dog","Elephant","fox","Frogs","Giraffe","Jellyfish","Kangaroo","lion","monkey","Piggies","Octopus","Sheep","Turtle","Whale","Zebra"];

const sentences = [
"The bear is eating a fish.",
"The two rabbits are jumping in the grass.",
"The cat is sleeping on the table.",
"The alligator is swimming.",
"The deer is running in the forest.",
"The dog is barking at the tree.",
"The elephant is drinking water.",
"The fox is smelling the flower.",
"The frogs are jumping over the leaves.",
"The giraffe is eating the leaves that are on top of the tree.",
"There are two jellyfish swimming in the ocean.",
"The kangaroo is carrying its baby.",
"The lion is thinking about his dinner.",
"The monkey is eating a banana.",
"The three pigs are happily eating.",
"The octopus is hiding behind a rock.",
"Two sheep are looking at the moon.",
"The turtle is walking.",
"The whale is sleeping.",
"The zebra is running in the fields."
];
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
    confirmButtonText: 'OK',
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
  console.log("puntajeActual: ",puntajeActual);
  if(puntajeActual < 0) {
    puntajeActual = playerCardQuantity;
  }
  const vistaPuntaje = document.getElementById('round_points_toend');
  vistaPuntaje.innerHTML = `<label id="round_points_toend">${puntajeActual} points left to win</label>`;
}




/*
Reproduce el archivo de sonido identificado como soundEffectSuccess
Se llama cuando hay un acierto
*/
function soundEffectSuccessFun(id) {
  let index = imgArray.indexOf(id,0);
  if(index != -1){
    soundArray[index].play();
  }else{
    soundEffectSuccess.play();
  }
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

function mapImgToSentence(text){
  let index = imgArray.indexOf(text,0);
  console.log("INDEX: ", index, imgArray,"/n",imgArray[index], sentences[index]);
  if(index != -1){
    return sentences[index];
  }
  return "";
}

/*
 Genera el html de cada carta de jugador para ser incluido en la sección lateral.
*/
function completePlayerCards(text) {
  console.log("completePlayerCards text: ",text);
  const sentence = mapImgToSentence(text);
  const newHtml = `<div id="c-${text}" class="grid-item-player">${sentence}</div>`;
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
  let imgArrayCopy = [...imgArray];
  const randomObjects = imgArrayCopy.sort(() => 0.5 - Math.random()).slice(0, objectQuantity);
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
    title: 'Congratulations, you have won!',
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
      soundEffectSuccessFun(id);
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
         /*  imageUrl: 'https://i.imgflip.com/44360m.jpg' ,*/
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
    showError('Error', 'You have not won yet.');
  }
}

function showHelp() {
  const htmlHelp = `<div class="help-content">
  <h3>Rules</h3>
  <ul>
  <li>The player will have a set of cards assigned for him or her to find.</li>
  <li>The cards assigned to the player will be sentences describing a card on the board.</li> 
  <li>The player will need to associate the sentence (his card) with an image on the game board.</li>
  <li>Once the player has found all of the cards matching the sentences, a message indicating that he has won will appear and a new game will be created (with the same game settings).</li>
  <li>If the winning button is selected, the player will need to press it once he has found all the cards. The winning message will not appear by itself.</li>
  </ul>

  <div>`;
  Swal.fire({
    title: 'Help',
    icon: 'info',
    html: htmlHelp,
    showCloseButton: true,
    focusConfirm: true,
    confirmButtonText:
      'Done',
    confirmButtonColor: baseColorOne,
  });
}

function showHelpSpanish() {
  const htmlHelp = `<div class="help-content">
  <h3>Reglas</h3>
  <ul>
  <li> El jugador tendrá un set de cartas asignado para que las encuentre. </li>
   <li> Las cartas asignadas al jugador serán frases que describen una imagen en el tablero. </li>
   <li> El jugador deberá asociar la oración (su carta) con una imagen en el tablero del juego. </li>
   <li> Una vez que el jugador haya encontrado todas las cartas que coincidan con las oraciones, aparecerá un mensaje que indica que ha ganado y se creará un nuevo juego (con la misma configuración del juego que estaba jugando). </li>
   <li> Si se selecciona el botón ganador ("winning button"), el jugador deberá presionarlo una vez que haya encontrado todas las cartas. El mensaje ganador no aparecerá solo. </li>
  </ul>

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


function showCredits() {
  const htmlHelp = `<div class="help-content">
  <h3>Game information</h3>
  <ul>
  <li> Creator: Nicole Castillo Arguedas</li>
  <li> Student project for TCU-501</li>
  <li> Designed for second grade students.</li> 
  <li> Theme: Fabulous Flora and Fauna, Unit 5</li>
  <li> Images designed by Sophia Borge</li>
  </ul>

  <div>`;
  Swal.fire({
    title: 'Credits',
    icon: 'info',
    html: htmlHelp,
    showCloseButton: true,
    focusConfirm: true,
    confirmButtonText:
      'Done',
    confirmButtonColor: baseColorOne,
  });
}
/*
Añade los eventos a los botones.
*/
function addEvents() {

  // Agregar evento al botón de ayuda
  const help = document.getElementById('help-tag');
  help.addEventListener('click', showHelp);

  const helpSpa = document.getElementById('help-tag-spa');
  helpSpa.addEventListener('click', showHelpSpanish);

  const credits = document.getElementById('credits');
  credits.addEventListener('click', showCredits);

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


//const soundArray = [bear, bunnies, cat, alligator, deer, dog, elephant, fox, frogs, jiraffe, jellyfish, kangaroo, lion, monkey, piggies, octopus, sheep, turtle, whale, zebra];

function initSounds(){
  for (let index = 0; index < soundArray.length; index++) {
    soundArray[index] = document.createElement('audio');
  }
  
  soundArray[0].src = 'audios/bear.ogg';
  soundArray[1].src = 'audios/rabbit.ogg';
  soundArray[2].src = 'audios/cat.ogg';
  soundArray[3].src = 'audios/alligator.ogg';
  soundArray[4].src = 'audios/deer.ogg';
  soundArray[5].src = 'audios/dog.ogg';
  soundArray[6].src = 'audios/elephant.ogg';
  soundArray[7].src = 'audios/fox.ogg';
  soundArray[8].src = 'audios/frog.ogg';
  soundArray[9].src = 'audios/giraffe.ogg';
  soundArray[10].src = 'audios/jellyfish.ogg';
  soundArray[11].src = 'audios/kangaroo.ogg';
  soundArray[12].src = 'audios/lion.ogg';
  soundArray[13].src = 'audios/monkey.ogg';
  soundArray[14].src = 'audios/pigs.ogg';
  soundArray[15].src = 'audios/octopus.ogg';
  soundArray[16].src = 'audios/sheep.ogg';
  soundArray[17].src = 'audios/turtle.ogg';
  soundArray[18].src = 'audios/whale.ogg';
  soundArray[19].src = 'audios/zebra.ogg';


}


/*
Carga los archivos de audio y los asocia a las variables
soundEffectSuccess y soundEffectFail respectivamente.
*/
function addSounds() {
  initSounds();
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

  //gameObjectsGenerator();
  gameFloraFaunaGenerator();
}

// Espera a que se cargue la pagina para iniciar la funcion de init
window.addEventListener('load', init);
window.onbeforeunload = closingCode;
