import { NextFunction, Request, Response } from "express";
import { Errors } from "../../helpers";
import Booking from "../../models/Booking";
import Provider from "../../models/Provider";

import Service from "../../models/Service";

export const services = {
    add: async (request: Request, response: Response, next: NextFunction) => {
        try {
            const service = await Service.create({ name: request.body.name });

            const body = {
                id: service._id,
                name: service.name,
            }

            response.status(201).json(body);

        } catch (error) {
            next(error);
        }
    },

    get: async (request: Request, response: Response, next: NextFunction) => {
        try {

            if (request.params.id) {

                const service = await Service.findById(request.params.id);

                if (!service) throw Errors.notFound('Service not found.');

                const providers = await Provider.find({ service: service._id }).populate('user').populate('service');

                const body = {
                    id: service._id,
                    name: service.name,
                    providers: providers.map((provider) => {
                        return {
                            id: provider._id,
                            price: provider.price,
                            user: {
                                id: provider.user._id,
                                firstname: provider.user.firstname,
                                lastname: provider.user.lastname,
                                email: provider.user.email,
                                role: provider.user.role,
                                created_at: provider.user.createdAt,
                                updated_at: provider.user.updatedAt,
                            },
                            service: {
                                id: provider.service._id,
                                name: provider.service.name,
                            }
                        }
                    }),
                }

                return response.status(200).json(body);
            }

            const services = await Service.find();

            if (!services) throw Errors.notFound('Services not found.');



            const body = await Promise.all(services.map(async (service) => {

                const providers = await Provider.find({ service: service._id }).populate('user').populate('service');

                return {
                    id: service._id,
                    name: service.name,
                    providers: providers.map((provider) => {
                        return {
                            id: provider._id,
                            price: provider.price,
                            user: {
                                id: provider.user._id,
                                firstname: provider.user.firstname,
                                lastname: provider.user.lastname,
                                email: provider.user.email,
                                role: provider.user.role,
                                created_at: provider.user.createdAt,
                                updated_at: provider.user.updatedAt,
                            },
                            service: {
                                id: provider.service._id,
                                name: provider.service.name,
                            }
                        }
                    }),
                }
            }));

            return response.status(200).json(body);


        } catch (error) {
            next(error);
        }
    },

    providers: async (request: Request, response: Response, next: NextFunction) => {
        try {

            const service = await Service.findById(request.params.id);

            if (!service) {
                throw Errors.notFound('Service not found');
            }

            const providers = await Provider.find({ service: service._id }).populate('user').populate('service');

            if (!providers) throw Errors.notFound('Service providers not found.');

            const body = await Promise.all(providers.map(async (provider) => {

                const bookings = await Booking.find({ provider: provider._id });

                return {
                    id: provider._id,
                    price: provider.price,
                    user: {
                        id: provider.user._id,
                        firstname: provider.user.firstname,
                        lastname: provider.user.lastname,
                        email: provider.user.email,
                        role: provider.user.role,
                        created_at: provider.user.createdAt,
                        updated_at: provider.user.updatedAt,
                    },
                    service: {
                        id: provider.service._id,
                        name: provider.service.name,
                    },
                    bookings: bookings.map((booking) => {
                        return {
                            id: booking._id,
                            date: booking.date,
                            total: booking.total,
                            status: booking.status,
                        }
                    }),
                }
            }));

            return response.status(200).json(body);

        } catch (error) {
            next(error);
        }
    },

    update: async (request: Request, response: Response, next: NextFunction) => {

        try {

            const service = await Service.findById(request.params.id);

            if (!service) throw Errors.notFound("Service not found.");

            if (request.body.name) service.name = request.body.name;

            await service.save();

            const body = {
                id: service._id,
                name: service.name
            }

            return response.status(200).json(body);

        } catch (error) {
            next(error);
        }

    },

    delete: async (request: Request, response: Response, next: NextFunction) => {

        try {

            const service = await Service.findById(request.params.id);

            if (!service) throw Errors.notFound("Service not found.");

            await service.remove();

            return response.status(200).json({
                message: "Service deleted."
            });

        } catch (error) {
            next(error);
        }

    }
}