const express = require ('express'); // llamar a express
const morgan = require('morgan');
const cors = require('cors');

const tracksRoutes = require('./routes/tracks.routes');

//inicializaciones
const app = express(); // servidor

//middlewares
app.use(cors());
app.use(morgan('dev'));

//rutas
app.use(tracksRoutes);
app.listen(3000);
console.log("Server en el puerto:",3000);
