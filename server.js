require("dotenv").config();
const express = require("express");
const bodyParser = require('body-parser');
const http = require("http");
const path = require('path');
const { sequelize } = require("./db_connection");
const { FOTOS_RUTA, PDF_RUTA, DNI_RUTA, CV_RUTA } = process.env;
const tareajeRutas = require("./routes/index");
const { PORT_TAREAJE } = process.env;
const { initializeSocket, userSockets } = require("./sockets");
const loginMiddleware = require("./checkers/validateToken");
const usuariosRouter = require("./routes/loginRouter");
const cors = require("cors");
const configurarCronJobs = require("./cronjobs/cron");

const app = express();

app.use(express.json({ limit: 'Infinity' }));
app.use(express.urlencoded({ limit: 'Infinity', extended: true }));

app.use(cors());
// app.use(cors({
//   origin: '*',
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));

//app.options('*', cors()); // Responde a todas las solicitudes OPTIONS automáticamente

// Permite que el servidor responda a solicitudes OPTIONS
// app.options('/login', cors());
// app.options('/uploads/fotos', cors());
// app.options('/uploads/pdfs', cors());


app.use(express.json());
app.use('/.well-known/acme-challenge/', express.static(path.resolve('/var/www/tareaje_backend/.well-known/acme-challenge'))); // Para certificado SSL
app.use("/login", usuariosRouter); // no aplica authMiddleware para el manejo de usuarios
app.use(loginMiddleware); // usa el middleware globalmente para validar todas las rutas a las que se va a acceder en el sistema solo estando logeado
const server = http.createServer(app); // servidor http a partir de express

initializeSocket(server); // Inicializamos Socket.io
app.use('/uploads/fotos', express.static(path.resolve(FOTOS_RUTA)));
app.use('/uploads/pdfs', express.static(path.resolve(PDF_RUTA)));
app.use('/uploads/pdfdni', express.static(path.resolve(DNI_RUTA)));
app.use('/uploads/cv', express.static(path.resolve(CV_RUTA)));
app.use("/", tareajeRutas);

app.get("/", (req, res) => {
  res.json({ success: "Hello World" });
});

// Configurar y ejecutar los CronJobs
configurarCronJobs()
  .then(() => console.log('CronJobs configurados exitosamente.'))
  .catch(err => console.error('Error al configurar los CronJobs:', err));

server.listen(PORT_TAREAJE, () => {
  console.log(`TAREAJE: Server is running on port ${PORT_TAREAJE}`);
  sequelize.sync({ alter: true })
    .then(() => console.log("Database is connected"))
    .catch(err => console.error("Error connecting to the database:", err));
});

module.exports = { userSockets };
