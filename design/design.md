# ¡Katamotza! - Wireframe

## Pantalla inicial

![Pantalla Inicial](.\..\img\wireframe\Pantalla Inicial.png)

## Ayuda

![Pantalla de Ayuda](.\..\img\wireframe\Ayuda.png)

## Sala de Espera - Anfitrión

![Sala de espera anfitrión](.\..\img\wireframe\Sala de Espera.png)

## Sala de Espera - Participante

![Sala de Espera - Participante](.\..\img\wireframe\Sala de Espera Participante.png)

## Juego

![Juego](.\..\img\wireframe\Juego.png)

## Máquina de estados

![](..\img\automata\automata.svg)

## Algoritmos de las transiciones de la máquina de estados

#### Mostrar créditos

Se muestra un pop up con los créditos de los ítems obtenidos de fuentes externas.

Se utiliza una librería externa para la implementación de los pop ups invocada con la palabra "Swal.fire" y enviando los parámetros correspondientes.

#### Abandonar

El servidor recibe el mensaje que indica el jugador que seleccionó abandonar la partida, una vez recibido eliminar al jugador del panel que indica el estado de los jugadores y hace un broadcast a los demás jugadores con la información actualizada (sin dicho jugador). Finalmente el jugador que abandonó la partida es redirigido a la pantalla de inicio.

Este procedimiento es el mismo si se está en la sala de espera ya que todos los clientes pueden ver los jugadores que se han unido a la partida.

#### Crear partida 

Se le envía un mensaje al servidor indicando el nombre del jugador y que será el anfitrión de la partida.

El servidor le devuelve un mensaje con el ID de la sesión.

El jugador es redirigido a la pantalla de "sala de espera anfitrión".

#### Unirse a partida

Se le envía un mensaje al servidor indicando el nombre del jugador y el ID de la sesión a la que se desea unir.

El servidor valida el ID y localiza la sesión.

El jugador es redirigido a la pantalla de "sala de espera invitado".

#### Iniciar partida

El cliente anfitrión al seleccionar iniciar la partida, envía un mensaje con las opciones de configuración elegidas. El servidor, una vez haya almacenado las opciones, envía un mensaje de "gameStart" en broadcast para todos los clientes.

Los demás jugadores invitados y el anfitrión son redirigidos a la página del juego, donde el Servidor envía un mensaje con el tablero, la asignación de cartas y la información necesaria para crear el juego.

#### Mostrar ayuda

Se muestra un pop up con las reglas del juego.

Se utiliza una librería externa para la implementación de los pop ups invocada con la palabra "Swal.fire" y enviando los parámetros correspondientes.

#### Click objeto incorrecto

El cliente valida si la carta seleccionada es correcta o incorrecta.

Se activa una animación y un sonido en la carta seleccionada.

#### Click objeto correcto

El cliente valida si la carta seleccionada es correcta o incorrecta.

Se activa una animación y un sonido en la carta seleccionada.

Se envía un mensaje al servidor para que valide si la carta seleccionada es correcta o incorrecta. Al ser correcta, el servidor hace un broadcast informando para que todos los clientes actualicen la información del panel de jugadores. La carta encontrada se volverá más transparente en la sección del jugador que la haya encontrado.

#### Stop

Al hacer click en el botón de Stop, se envía un mensaje al servidor para que revise si dicho jugador ha ganado, de haber ganado hace un broadcast comunicando el ganador y la finalización de la partida. Esto se muestra mediante un mensaje pop up.

Para el ganador se activa un pop up diferente que indica que ganó, a los demás jugadores se indica el nombre del jugador que ganó.

En caso de que el jugador haya hecho click en el botón de Stop y la comprobación de si ganó en el servidor es falso, entonces se le muestra un mensaje de error de tipo pop up al jugador correspondiente.

Se utiliza una librería externa para la implementación de los pop ups invocada con la palabra "Swal.fire" y enviando los parámetros correspondientes.

#### Ronda finalizada

Cuando se cambia de ronda, el servidor envía en forma de broadcast una nueva repartición de cartas y se generan nuevos objetos en el tablero.

Los clientes al recibirlo actualizan su pantalla con la nueva información.

#### Hay ganador

Cuando un jugador encuentra su última carta (y la regla de utilizar el botón de Stop esta desactivada), se envía un mensaje al servidor para que revise si dicho jugador ha ganado, de haber ganado hace un broadcast comunicando el ganador y la finalización de la partida. Esto se muestra mediante un mensaje pop up.

Para el ganador se activa un pop up diferente que indica que ganó, a los demás jugadores se indica el nombre del jugador que ganó.

En caso de que el jugador haya hecho click en el botón de Stop y la comprobación de si ganó en el servidor es falso, entonces se le muestra un mensaje de error de tipo pop up al jugador correspondiente.

Se utiliza una librería externa para la implementación de los pop ups invocada con la palabra "Swal.fire" y enviando los parámetros correspondientes.

#### Partida finalizada

Los jugadores son redirigidos a la pantalla de inicio.