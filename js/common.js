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
      confirmButtonText: 'OK',
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
        `${'Fix the following errors: '
        + '<ul>'}${html}</ul> `,
      showCloseButton: true,
      focusConfirm: true,
      confirmButtonText:
        'OK',
      confirmButtonColor: baseColorOne,
    });
  }

  static showHelp() {
    const htmlHelp = `<div class="help-content">
      <h3>Game's rules</h3>
      <ul>
        <li>RULES: TO DO</li>
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

  static exitConfirm(socket) {
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
            leaveGame(socket);
            localStorage.clear();
            window.open('./', '_self');
          },
        });
      }
    });
  }
}
