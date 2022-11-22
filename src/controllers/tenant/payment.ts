import { NextFunction, Request, Response } from "express";
import { Stripe } from "stripe";
import { Errors } from "../../helpers";
import Booking from "../../models/Booking";

const key: any = process.env.STRIPE_SECRET_KEY;

const stripe = new Stripe(key, { apiVersion: "2022-11-15" });

export default async function pay(request: Request, response: Response, next: NextFunction) {
    try {

        const { id } = request.body;

        const booking = await Booking.findById(id);

        if(!booking) throw Errors.notFound("Booking not found");

        const intent = await stripe.paymentIntents.create({
            amount: Math.round(booking.total * 100),
            currency: "USD",
            payment_method_types: ["card"],
            metadata: {id: booking.id},
        })

        const client = intent.client_secret;

        response.status(200).json({key: client})

    } catch (error) {
        next(error);
    }
}