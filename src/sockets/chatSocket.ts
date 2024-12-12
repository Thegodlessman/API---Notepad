import { Server, Socket } from "socket.io";
import { Message } from "../models/message";

export const chatSocket = (io: Server) => {
    io.on("connection", (socket: Socket) => {
        console.log("Usuario conectado:", socket.id);

        // Unirse a una sala específica
        socket.on("joinRoom", (userId: string) => {
            if (!userId) return;
            socket.join(userId);
            console.log(`Usuario ${userId} se unió a su sala`);
        });

        // Escuchar nuevos mensajes
        socket.on("sendMessage", async (data: { sender: string; receiver: string; content: string }) => {
            try {
                const { sender, receiver, content } = data;

                // Guardar mensaje en la base de datos
                const newMessage = new Message({ sender, receiver, content });
                await newMessage.save();

                // Emitir mensaje al receptor
                io.to(receiver).emit("receiveMessage", newMessage);
            } catch (error) {
                console.error("Error enviando mensaje:", error);
            }
        });

        // Desconexión
        socket.on("disconnect", () => {
            console.log("Usuario desconectado:", socket.id);
        });
    });
};
