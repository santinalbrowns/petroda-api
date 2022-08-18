import { NextFunction, Request, Response } from "express";
import { STATUS } from "../../enum";
import { Errors } from "../../helpers";
import Booking from "../../models/Booking";
import Provider from "../../models/Provider";
import Tenant from "../../models/Tenant";

export const bookings = {
    get: async (request: Request, response: Response, next: NextFunction) => {
        try {
            if (request.params.id) {

                const booking = await Booking.findById(request.params.id);

                if(!booking) {
                    throw Errors.notFound('Booking not found.');
                }

                const provider = await Provider.findById(booking.provider._id).populate('user').populate('service');

                const body = {
                    id: booking._id,
                    date: booking.date,
                    total: booking.total,
                    status: booking.status,
                    provider: {
                        id: provider?._id,
                        price: provider?.price,
                        user: {
                            id: provider?.user._id,
                            firstname: provider?.user.firstname,
                            lastname: provider?.user.lastname,
                            email: provider?.user.email,
                        },
                        service: {
                            id: provider?.service._id,
                            name: provider?.service.name
                        }
                    }
                }

                return response.status(200).json(body);
            }

            const bookings = await Booking.find();

            const body = await Promise.all(bookings.map(async (book) => {

                const provider = await Provider.findById(book.provider._id).populate('user').populate('service');

                return {
                    id: book._id,
                    date: book.date,
                    total: book.total,
                    status: book.status,
                    provider: {
                        id: provider?._id,
                        price: provider?.price,
                        user: {
                            id: provider?.user._id,
                            firstname: provider?.user.firstname,
                            lastname: provider?.user.lastname,
                            email: provider?.user.email,
                        },
                        service: {
                            id: provider?.service._id,
                            name: provider?.service.name
                        }
                    }
                }
            }));

            response.status(200).json(body);

        } catch (error) {
            next(error);
        }
    },

    delete: async (request: Request, response: Response, next: NextFunction) => {
        try {
            const booking = await Booking.findById(request.params.id);

            if(!booking) throw Errors.notFound("Booking not found");

            await booking.remove();

            response.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}