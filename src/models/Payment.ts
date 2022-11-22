import mongoose from "mongoose";
import { Booking } from "../interfaces";

export interface IPayment {
    [x: string]: any;
    paid: boolean;
    total: number;
    ref: string;
    booking: Booking['_id'];
}

const schema = new mongoose.Schema(
    {
        paid: {type: Boolean, required: true},
        total: {type: Number, required: true},
        ref: {type: String},
        booking: {type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true},
    },
    {
        timestamps: true
    }
);

const Payment = mongoose.model<IPayment>('Payment', schema);

export default Payment;