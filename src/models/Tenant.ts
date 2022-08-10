import mongoose from "mongoose";
import { Tenant } from "../interfaces";

const schema = new mongoose.Schema(
    {
        house: { type: mongoose.Schema.Types.ObjectId, ref: 'House', required: true },
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
    },
    { timestamps: true }
);

const Tenant = mongoose.model<Tenant>('Tenant', schema);

export default Tenant;