import http from "http";
import { Server } from "socket.io";
import app from './app';
import './database';
import { chatSocket } from "./sockets/chatSocket";

// Crear servidor HTTP
const server = http.createServer(app);

// Configurar Socket.IO
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

// Configurar lógica de sockets
chatSocket(io);

// Iniciar el servidor
const PORT = app.get('port') || 5000;
server.listen(PORT, () => {
    console.log(`Servidor corriendo en: ${PORT}`);
});
