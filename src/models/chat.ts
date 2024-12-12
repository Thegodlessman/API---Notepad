import mongoose, { Schema, Document } from "mongoose";

export interface IMessage extends Document {
    senderId: string;
    content: string;
    type: string;
    timestamp: Date;
}

const messageSchema = new Schema<IMessage>({
    senderId: { type: String, required: true },
    content: { type: String, required: true },
    type: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
});

const chatSchema = new Schema({
    participants: [{ type: Schema.Types.ObjectId, ref: "User" }],
    messages: [messageSchema],
});

const Chat = mongoose.model("Chat", chatSchema);
export default Chat;
