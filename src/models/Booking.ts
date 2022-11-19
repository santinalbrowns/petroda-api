import mongoose from "mongoose";
import { STATUS } from "../enum";
import { Booking } from "../interfaces";

const schema = new mongoose.Schema(
    {
        date: {type: Date, required: true},
        total: {type: Number, required: true},
        status: {type: String, enum: [STATUS.PENDING, STATUS.INCOMPLETE, STATUS.COMPLETED, STATUS.APPROVED, STATUS.DECLINED]},
        provider: {type: mongoose.Schema.Types.ObjectId, ref: 'Provider', required: true},
        tenant: {type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true},
    },
    {timestamps: true}
);

const Booking = mongoose.model<Booking>('Booking', schema);

export default Booking;