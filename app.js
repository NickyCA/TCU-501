const express = require('express');

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');
const fs = require('fs');
const morgan = require('morgan');

const gameServer = require('./js/gameServer');
// const { nextTick } = require('process');


const port = process.env.PORT || 3000;

function configureServer() {
  app.use(express.static(path.join(__dirname)));
  
}

function configureRoutes() {
  app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.sendFile(path.join(__dirname, 'index.xhtml'));
  });

  app.get('/juego', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.sendFile(path.join(__dirname, 'juego.xhtml'));
  });

  app.get('/salaespera', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.sendFile(path.join(__dirname, 'sala_espera.xhtml'));
  });

  app.get('/salaanfitrion', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.sendFile(path.join(__dirname, 'sala_anfitrion.xhtml'));
  });

  app.get('/creditos', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.sendFile(path.join(__dirname, 'creditos.xhtml'));
  });

}

function configureSocketsEvents() {
  // Configura la aplicación para escuchar mensajes de sockets.
  io.on('connection', (socket) => {
    // Escucha y procesa los mensajes que provienen de los clientes.
    socket.on('fromClient', (msg) => {
      console.log(`CLIENT => ${msg}`);
      const announcement = JSON.parse(msg);
      if (announcement !== undefined && announcement.messageType === 'announce') {
        socket.join(announcement.gameId);
        console.log(`Room ${announcement.gameId} aceptando al jugador ${announcement.playerId} `);
        console.log(`¿Estoy en el room? ${io.sockets.adapter.sids[socket.id][announcement.gameId]}`);
      } else {
        // Evalua el mensaje y espera una respuesta.
        const answer = gameServer.parseMessages(msg);

        if (answer && answer.serverMsg !== '') {
          console.log(`SERVER => ${JSON.stringify(answer)}`);
          // Si la respuesta trae contenido la procesa.
          if (answer.broadcast === true) {
            if (answer.gameRoomId !== '') {
              console.log(`¿Estoy en el room? ${io.sockets.adapter.sids[socket.id][answer.gameRoomId]}`);
              if (io.sockets.adapter.sids[socket.id][answer.gameRoomId] === undefined) {
                socket.join(answer.gameRoomId);
              }
              console.log(`¿Estoy en el room? ${io.sockets.adapter.sids[socket.id][answer.gameRoomId]}`);
              // Si la respuesta es un broadcasting envia el mensaje a todos en el gameRoom
              io.to(answer.gameRoomId).emit('fromServer', answer.serverMsg);
            } else {
              // Si la respuesta es un broadcasting envia el mensaje a todos
              io.emit('fromServer', answer.serverMsg);
            }
          } else {
            // En caso contrario solo responde al socket que envió el mensaje.
            socket.emit('fromServer', answer.serverMsg);
          }
        }
      }
    });

    // Procesa el mensaje para unirse a una sesión de juego.
    socket.on('gameRoom', (msg) => {
      const connectRoomMsg = JSON.parse(msg);

      console.log(`SocketId: ${socket.id} GameId: ${connectRoomMsg.gameId} PlayerId: ${connectRoomMsg.playerId}`);
      socket.join(connectRoomMsg.gameId);
    });
  });
}

function configureHTTPListener() {
  http.listen(port, () => {
    console.log(`listening on *:${port}`);
  });
}

function serverInitialization() {
  // Configura las opciones del servidor
  configureServer();

  // Configura las rutas
  configureRoutes();

  // Configura los eventos de los sockets.
  configureSocketsEvents();

  // Configura el listener de peticiones HTTP
  configureHTTPListener();
}

serverInitialization();
