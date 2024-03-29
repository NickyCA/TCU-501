const objectTotal = 20;
const baseColorOne = '#f27294';
const baseColorTwo = '#f2dc6b';
const baseColorOnergba = 'rgba(242,114,148,0.1)';
const baseColorGrayrgba = 'rgba(240,240,240,0.1)';

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
       /*  imageUrl: 'https://i.imgflip.com/44360m.jpg', */
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
      errors.push('Amount of objects in board is not a valid number.');
    }

    if (Number.isNaN(playersCardsQuantity)) {
      error = 'Amount of cards to find is not a valid number';
      errors.push(error);
    }

    if (playersCardsQuantity > objectTotal) {
      error = 'Amount of cards to find can not be more than '+ objectTotal;
      errors.push(error);
    }
  
    if (objectsQuantity > objectTotal) {
      error = 'Amount of objects on board can not be more than '+ objectTotal;
      errors.push(error);
    }
  
    return errors;
  }

  function gameReminders() {
    const newHtml = `
    <li>${'The amount of cards to find and the amount of objects on board can not be more than '+ objectTotal}</li>
    `;

    const playersContainer = document.getElementById('tip');
    playersContainer.innerHTML += newHtml;
  
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
      showInputsError(errors, 'Wrong settings');
    }
  }




  function addEvents() {
    // Agregar evento al botón de abandonar
    const leave = document.getElementById('leave');
    leave.addEventListener('click', () => { exitConfirm(); });
  
    // Agregar evento al botón de ayuda
    const help = document.getElementById('help-tag');
    help.addEventListener('click', showHelp);

    const helpSpa = document.getElementById('help-tag-spa');
    helpSpa.addEventListener('click', showHelpSpanish);

    const credits = document.getElementById('credits');
    credits.addEventListener('click', showCredits);

    const initGame = document.getElementById('play');
    initGame.addEventListener('click', startGame);
  }
  


  function init() {
    insertPlayersHtml();
    gameReminders();
    addEvents();
    localStorage.setItem('state', 'waiting');
  }
  
  // Espera a que se cargue la pagina para iniciar la funcion de init
  window.addEventListener('load', init);
 