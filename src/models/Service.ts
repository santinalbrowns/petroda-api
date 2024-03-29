import mongoose from "mongoose";
import { Service } from "../interfaces";

//remove category

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    }
});

const Service = mongoose.model<Service>('Service', schema);

export default Service;
