const objectTotal = 6;
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

function insertPlayersHtml() {
    const newHtml = `
    <h3>${localStorage.getItem('playerName')}</h3>
    `;

    const playersContainer = document.getElementById('players_tag');
    playersContainer.innerHTML = newHtml;
  }


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

function gameLoad(){
    Swal.fire({
        title: 'Game will start soon!',
        timer: 20000,
        timerProgressBar: true,
        didOpen: () => {
          Swal.showLoading()
          timerInterval = setInterval(() => {
            const content = Swal.getHtmlContainer()
            if (content) {
              const b = content.querySelector('b')
              if (b) {
                b.textContent = Swal.getTimerLeft()
              }
            }
          }, 100)
        },
        willClose: () => {
          clearInterval(timerInterval)
        }
      }).then((result) => {
        window.open('./juego.xhtml', '_self');
      })
}


function showInputsError(errors, titleText) {
    const html = errors.map((error) => `<li>${error}</li>`).join('');
    Swal.fire({
      title: titleText,
      icon: 'error',
      html:
        `${'Fix the following errors: '
        + '<ul>'}${html}</ul> `,
      showCloseButton: true,
      focusConfirm: true,
      confirmButtonText:
        'OK',
      confirmButtonColor: baseColorOne,
    });
  }


/**
 * Revisa que las configuraciones de la partida seleccionadas sean validos
 * Genera mensajes especificos para cada error
 * @param {int} objectsQuantity
 * @param {int} playersCardsQuantity
 */
 function gameOptionsValidate(objectsQuantity, playersCardsQuantity) {
    const errors = [];
    if (Number.isNaN(objectsQuantity)) {
      errors.push('El valor para la cantidad de objetos en el tablero no es válido.');
    }

    if (Number.isNaN(playersCardsQuantity) || playersCardsQuantity > objectsQuantity) {
      errors.push('El valor para la cantidad de cartas por jugador no es válido.');
    }
  
    if (objectsQuantity > objectTotal) {
      error = 'La cantidad de objetos en el tablero no puede ser mayor a '+ objectTotal;
      errors.push(error);
    }
  
    return errors;
  }

  function startGame() {
    const objectsQuantity = parseInt(document.getElementById('input_objects_quantity').value, 10);
    const playersCardsQuantity = parseInt(document.getElementById('input_playercards_quantity').value, 10);
    const stopButton = document.getElementById('chk_winner_option').checked;
  
    const errors = gameOptionsValidate(objectsQuantity, playersCardsQuantity);
  
    if (errors.length === 0) {
      localStorage.setItem("objectsQuantity", objectsQuantity);
      localStorage.setItem("playersCardsQuantity", playersCardsQuantity);
      localStorage.setItem("stopButton", stopButton);
      window.open('./juego.xhtml', '_self');
        
    } else {
      showInputsError(errors, 'No se puede iniciar la partida');
    }
  }




  function addEvents() {
    // Agregar evento al botón de abandonar
    const leave = document.getElementById('leave');
    leave.addEventListener('click', () => { exitConfirm(); });
  
    // Agregar evento al botón de ayuda
    const help = document.getElementById('help-img-button');
    help.addEventListener('click', showHelp);

    const initGame = document.getElementById('play');
    initGame.addEventListener('click', startGame);
  }
  


  function init() {
    insertPlayersHtml();
    addEvents();
    localStorage.setItem('state', 'waiting');
  }
  
  // Espera a que se cargue la pagina para iniciar la funcion de init
  window.addEventListener('load', init);
 