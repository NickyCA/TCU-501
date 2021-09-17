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
      confirmButtonText: 'Start',
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      confirmButtonColor: baseColorOne,
      cancelButtonColor: baseColorTwo,
      progressSteps: ['1'],
    }).queue([
      {
        title: 'Name',
        text: 'Please enter your name',
      },
    ]).then((result) => {
      if (result.value) {
        if (validateUserInput(result.value, true)) {
          localStorage.setItem('playerName', result.value[0]);
          redirectFunctionWaiting();
        }
      }
    });
  }

function redirectFunctionWaiting() {
    window.location.href = "./sala_espera.xhtml";
  }
  
  function addEvents() {
    // Agregar evento al botón de crear sesión.
    const create = document.getElementById('create');
    create.addEventListener('click', askUserHostGuestGameInfo);
  
  
    // Agregar evento al botón de ayuda
    const help = document.getElementById('help-tag');
    help.addEventListener('click', showHelp);

    const helpSpa = document.getElementById('help-tag-spa');
    helpSpa.addEventListener('click', showHelpSpanish);

    const credits = document.getElementById('credits');
    credits.addEventListener('click', showCredits);
    
  }

  
  /*
  Función inicial.
  */
  function init() {
    addEvents();
  }
  
  // Espera a que se cargue la pagina para iniciar la funcion de init
  window.addEventListener('load', init);
 
  