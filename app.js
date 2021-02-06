const express = require('express');

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');
const fs = require('fs');


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
  //configureSocketsEvents();

  // Configura el listener de peticiones HTTP
  configureHTTPListener();
}

serverInitialization();
