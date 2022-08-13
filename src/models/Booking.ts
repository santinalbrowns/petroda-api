import mongoose from "mongoose";
import { STATUS } from "../enum";
import { Booking } from "../interfaces";

const schema = new mongoose.Schema(
    {
        date: {type: Date, required: true},
        total: {type: Number, required: true},
        status: {type: String, enum: [STATUS.PENDING, STATUS.INCOMPLETE, STATUS.COMPLETED]},
        provider: {type: mongoose.Schema.Types.ObjectId, ref: 'provider', required: true},
        tenant: {type: mongoose.Schema.Types.ObjectId, ref: 'tenant', required: true},
    },
    {timestamps: true}
);

const Booking = mongoose.model<Booking>('Booking', schema);

export default Booking;