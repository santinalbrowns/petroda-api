import mongoose from "mongoose";
import { Service } from "../interfaces";

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    }
});

const Service = mongoose.model<Service>('Service', schema);

export default Service;
