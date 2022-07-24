import mongoose from "mongoose";
import { House } from "../interfaces";

const schema = new mongoose.Schema({
    number: { type: Number, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true }
})

const House = mongoose.model<House>("House", schema);

export default House;