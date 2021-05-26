// importamos libreria
const express = require ('express');
// el numero de puerto esta en config
const {PORT} = require ('./src/config');
// importamos app_Routing
const app_Routing = require ('./src/handlers');
// iniciamos nuestra aplicacion
const app = express ();
// Middleware 1 - utilizamos body parser
app.use (express.json ());
// middlaware 2
app.use (app_Routing);
// los datos enviados a index.js (handlers)

// inicializamos
//y mostramos informacion cuando se termine de cargar
app.listen (PORT, () => {
  console.info (`Escuchando en el puerto : ${PORT}`);
});
