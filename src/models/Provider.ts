import mongoose from "mongoose";
import { Provider } from "../interfaces";

const schema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    description: {type: String, default: ''},
});

const Provider = mongoose.model<Provider>('Provider', schema);

export default Provider;