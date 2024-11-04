
const socketIo = require("socket.io");

// Mapa para almacenar los sockets de los usuarios
const userSockets = new Map();

let io; // Declaramos io como variable global en este módulo

function initializeSocket(server) {
    io = socketIo(server);

    io.on("connection", (socket) => {
        console.log(`Nuevo cliente conectado: ${socket.id}`);

        // Evento de registro: asociamos el socket con el usuario
        socket.on("register", (userName) => {
            console.log("registro:",userName);
            userSockets.set(userName, socket); // Asocia el ID de usuario con el socket
        });

        // Desconexión: eliminamos el socket del mapa
        socket.on("disconnect", () => {
            userSockets.forEach((value, key) => {
                console.log("DESCONECTO PAPI");
                if (value.id === socket.id) {
                    userSockets.delete(key); // Elimina el socket asociado al userName
                }
            });
            console.log(`Cliente desconectado: ${socket.id}`);
        });
    });
}

module.exports = { initializeSocket, userSockets };
