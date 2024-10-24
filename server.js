require("dotenv").config();
const express = require("express");
const server = express();
const { sequelize } = require("./db_connection");

const tareajeRutas = require("./routes/index")
const { PORT_TAREAJE } = process.env;

server.use(express.json());
server.use("/",tareajeRutas);
server.get("/", (req, res) => {
    res.json({ hola: "Hello World" });
});

server.listen(PORT_TAREAJE, () => {
    console.log(`TAREAJE: Server is running on port ${PORT_TAREAJE}`);
    sequelize.sync({ force: true }).then(
        console.log("Database is connected")
    );
});