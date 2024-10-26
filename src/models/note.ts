import mongoose, {model, Schema, Document} from 'mongoose'

export interface INote extends Document{
    title: string;
    content: string;
    owner: string;
    categoryName: string;
    favorite: boolean;
    trash: boolean;
}

const noteSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    owner: {
        type: String,
        required: true
    },
    categoryName:{
        type: String,
        required: true
    },
    favorite: {
        type: Boolean,
        required: false
    },
    trash:{
        type: Boolean,
        required: false
    },
}, {
    timestamps: true,
});

export default model<INote>('Note', noteSchema);