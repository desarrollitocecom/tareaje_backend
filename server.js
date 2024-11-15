require("dotenv").config();
const express = require("express");
const bodyParser = require('body-parser');
const http = require("http");
const { sequelize } = require("./db_connection");
const tareajeRutas = require("./routes/index");
const { PORT_TAREAJE } = process.env;
const { initializeSocket, userSockets } = require("./sockets");
const loginMiddleware = require("./checkers/validateToken");
const usuariosRouter = require("./routes/loginRouter");
const cors = require("cors");

const app = express();

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());
app.use(express.json());
app.use("/login", usuariosRouter); // no aplica authMiddleware para el manejo de usuarios
app.use(loginMiddleware); // usa el middleware globalmente para validar todas las rutas a las que se va a acceder en el sistema solo estando logeado
const server = http.createServer(app); // servidor http a partir de express

initializeSocket(server); // Inicializamos Socket.io

app.use("/", tareajeRutas);

app.get("/", (req, res) => {
  res.json({ success: "Hello World" });
});

server.listen(PORT_TAREAJE, () => {
  console.log(`TAREAJE: Server is running on port ${PORT_TAREAJE}`);
  sequelize.sync({ alter: false })
    .then(() => console.log("Database is connected"))
    .catch(err => console.error("Error connecting to the database:", err));
});

module.exports = { userSockets };
