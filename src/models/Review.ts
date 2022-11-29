import mongoose from "mongoose";
import { Provider, Tenant } from "../interfaces";


export interface Review {
    [x:string]: any;
    rate: number;
    comment: string;
    provider: Provider['_id'];
    tenant: Tenant['_id'];
}

const schema = new mongoose.Schema({
    rate: {type: Number, required: true, min: 0, max: 5},
    comment: {type: String, default: ''},
    provider: {type: mongoose.Schema.Types.ObjectId, ref: 'Provider'},
    tenant: {type: mongoose.Schema.Types.ObjectId, ref: 'Tenant'},
}, {timestamps: true});

const Review = mongoose.model<Review>('Review', schema);

export default Review;