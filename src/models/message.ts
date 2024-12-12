import mongoose, { Schema, Document } from "mongoose";

export interface IMessage extends Document {
    sender: string;
    receiver: string;
    content: string;
    timestamp: Date;
}

const messageSchema = new Schema<IMessage>({
    sender: { type: String, required: true },
    receiver: { type: String, required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
});

export const Message = mongoose.model<IMessage>("Message", messageSchema);
