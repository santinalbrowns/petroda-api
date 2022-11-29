import { NextFunction, Request, Response } from "express";
import { STATUS } from "../../enum";
import { Errors } from "../../helpers";
import Booking from "../../models/Booking";
import Provider from "../../models/Provider";
import Review from "../../models/Review";

import Service from "../../models/Service";
import Tenant from "../../models/Tenant";

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
                            description: provider.description,
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
                            description: provider.description,
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

                const bookings = await Booking.find({ provider: provider._id, status: STATUS.COMPLETED });

                const reviews = await Review.find({ provider: provider.id }).populate('tenant');

                const data = await Promise.all(reviews.map(async (review) => {

                    const tenant = await Tenant.findById(review.tenant._id).populate("user");

                    return {
                        id: review._id,
                        rate: review.rate,
                        comment: review.comment,
                        user: {
                            firstname: tenant?.user.firstname,
                            lastname: tenant?.user.lastname,
                        },
                        date: review.createdAt,
                    }

                }));

                return {
                    id: provider._id,
                    price: provider.price,
                    description: provider.description,
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
                    reviews: {
                        total: 4.5,
                        data: data,
                    },
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

            return response.status(204).send();

        } catch (error) {
            next(error);
        }

    }
}