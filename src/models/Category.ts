import mongoose from "mongoose";
import { Category } from "../interfaces";

const schema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true }
});

const Category = mongoose.model<Category>('Category', schema);

export default Category;