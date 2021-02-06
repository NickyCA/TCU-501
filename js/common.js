const baseColorOne = '#f27294';
const baseColorTwo = '#f2dc6b';
const baseColorOnergba = 'rgba(242,114,148,0.1)';
const baseColorGrayrgba = 'rgba(240,240,240,0.1)';

function leaveGame(socket) {
  const leaveGameMessage = {
    messageType: 'leaveGame',
    gameId: localStorage.getItem('gameId'),
    playerId: localStorage.getItem('playerId'),
  };

  socket.emit('fromClient', JSON.stringify(leaveGameMessage));
  socket.disconnect();
}

export default class Common {
  static GetBaseColorOne() {
    return baseColorOne;
  }

  static GetBaseColorTwo() {
    return baseColorTwo;
  }

  static GetBaseColorOnergba() {
    return baseColorOnergba;
  }

  static GetBaseColorGrayrgba() {
    return baseColorGrayrgba;
  }

  static showCommonError(titleText, errorMessage, callback) {
    Swal.fire({
      icon: 'error',
      title: titleText,
      text: errorMessage,
      confirmButtonText: 'Bueno',
      confirmButtonColor: baseColorOne,
      timer: 2000,
      timerProgressBar: true,
      willClose: () => {
        if (callback) {
          callback();
        }
      },
    });
  }

  static showInputsError(errors, titleText) {
    const html = errors.map((error) => `<li>${error}</li>`).join('');
    Swal.fire({
      title: titleText,
      icon: 'error',
      html:
        `${'Corrija los siguientes errores: '
        + '<ul>'}${html}</ul> `,
      showCloseButton: true,
      focusConfirm: true,
      confirmButtonText:
        'Bueno',
      confirmButtonColor: baseColorOne,
    });
  }

  static showHelp() {
    const htmlHelp = `<div class="help-content">
      <h3>Reglas del juego</h3>
      <ul>
        <li>Cada jugador tratará de encontrar las cartas asignadas en el tablero</li>
        <li>Las cartas asignadas se mostrarán sin color, sin embargo, en el tablero los colores variaran.</li> 
        <li>Si se juega por rondas, cada ronda deberán encontrarse la cantidad de cartas configuradas por el anfitrión.</li>
        <li>Si se juega por puntos, independientemente del número de cartas faltantes por encontrar, si se ha alcanzado la cantidad de puntos configurado. 
        por el anfitrión entonces dicho jugador ganará.</li>
        <li>Si se activa el botón de ganador, deberá presionarse este botón para indicar que se ha ganado la partida, de lo contrario
        el juego no anunciará un ganador hasta que alguien lo presione (y haya encontrado todas sus cartas).</li>
        <li>Si se activa la carta trampa, podrá ocultarse una carta de un contrincante. Solo se puede una por ronda.</li>
      </ul>
      <h3>Créditos</h3>
      <p>Logo creado por <a href="https://www.flaticon.com/authors/freepik" title="Freepik" target="_blank">Freepik</a></p>
      <p>Fuente de los íconos obtenidos <a href="https://mariodelvalle.github.io/CaptainIconWeb/" target="_blank">aquí</a></p>
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

  static exitConfirm(socket) {
    Swal.fire({
      title: '¿Abandonar la partida?',
      text: 'Volverá a la pantalla de inicio',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: baseColorOne,
      cancelButtonColor: baseColorTwo,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
      focusCancel: true,
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Saliendo',
          text: '¡Adiós!',
          imageUrl: 'https://i.imgflip.com/44360m.jpg',
          timer: 2000,
          timerProgressBar: true,
          confirmButtonText: 'Bueno',
          confirmButtonColor: baseColorOne,
          willClose: () => {
            leaveGame(socket);
            localStorage.clear();
            window.open('./', '_self');
          },
        });
      }
    });
  }
}
