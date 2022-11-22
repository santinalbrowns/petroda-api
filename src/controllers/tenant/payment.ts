import { NextFunction, Request, Response } from "express";
import Stripe from "stripe";
import { STATUS } from "../../enum";
import { Errors } from "../../helpers";
import Booking from "../../models/Booking";
import Payment from "../../models/Payment";

const key: any = process.env.STRIPE_SECRET_KEY;

const stripe = new Stripe(key, { apiVersion: "2022-11-15" });

export default async function pay(request: Request, response: Response, next: NextFunction) {
    try {

        const { id } = request.body;

        const booking = await Booking.findById(id);

        if (!booking) throw Errors.notFound("Booking not found");

        const intent = await stripe.paymentIntents.create({
            amount: Math.round(booking.total * 100),
            currency: "USD",
            payment_method_types: ["card"],
            metadata: { id: booking.id },
        })

        const client = intent.client_secret;

        response.status(200).json({ key: client })

    } catch (error) {
        next(error);
    }
}

export async function verify(request: Request, response: Response, next: NextFunction) {
    const sig: any = request.headers['stripe-signature'];
    const key: any = process.env.STRIPE_WEBHOOK_SECRET;

    let event: Stripe.Event;

    console.log(request.originalUrl);

    try {
        event = stripe.webhooks.constructEvent(request.body, sig, key);

        // Successfully constructed event
        console.log('✅ Success:', event.id);

        // Cast event data to Stripe object
        if (event.type === 'payment_intent.succeeded') {
            const stripeObject: Stripe.PaymentIntent = event.data
                .object as Stripe.PaymentIntent;
            
                console.log(`💰 PaymentIntent status: ${stripeObject.status}`);
        } else if (event.type === 'charge.succeeded') {
            const charge = event.data.object as Stripe.Charge;
            
            console.log(`💵 Charge id: ${charge.id}`);

            await Payment.create({
                paid: charge.paid,
                total: charge.amount,
                ref: charge.id,
                booking: charge.metadata.id,
            });

            const booking = await Booking.findById(charge.metadata.id);

            if(booking) {
                booking.status = STATUS.COMPLETED;

                await booking.save();
            }

        } else {
            console.warn(`🤷‍♀️ Unhandled event type: ${event.type}`);
        }

        // Return a response to acknowledge receipt of the event
        return response.json({ received: true });

    } catch (error) {
        next(error);
    }



}