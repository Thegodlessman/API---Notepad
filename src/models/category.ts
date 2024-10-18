import { model, Schema, Document } from "mongoose";

export interface ICat extends Document{
    name: string, 
    description: string,
    owner: string
}

const catSchema = new Schema({
    name: {
        type: String, 
        required: true
    },
    description: {
        type: String,
        required: true
    },
    owner: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

export default model<ICat>('Category', catSchema);