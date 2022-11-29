import { NextFunction, Request, Response } from "express";
import { ROLE } from "../../enum";
import { Errors } from "../../helpers";
import Provider from "../../models/Provider";
import Review from "../../models/Review";
import Service from "../../models/Service";
import Tenant from "../../models/Tenant";
import User from "../../models/User";

export const providers = {
    add: async (request: Request, response: Response, next: NextFunction) => {
        try {

            const user = await User.findOne({ _id: request.body.user, role: ROLE.PROVIDER });

            if (!user) throw Errors.notFound('User not found');

            const service = await Service.findById(request.body.service);

            if (!service) throw Errors.notFound('Service not found');

            const result = await Provider.findOne({ user: user._id, service: service._id });

            if (result) {
                throw Errors.conflict('Provider already exists.');
            }

            const provider = new Provider({
                user: user._id,
                service: service._id,
                price: request.body.price,
                description: request.body.description,
            });

            await provider.save();

            const body = {
                id: provider._id,
                price: provider.price,
                description: provider.description,
                user: {
                    id: user._id,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    email: user.email,
                    role: user.role,
                    created_at: user.createdAt,
                    updated_at: user.updatedAt,
                },
                service: {
                    id: service._id,
                    name: service.name
                }
            }

            response.status(201).json(body);

        } catch (error) {
            next(error);
        }
    },

    get: async (request: Request, response: Response, next: NextFunction) => {
        try {
            if (request.params.id) {

                const provider = await Provider.findById(request.params.id).populate('user').populate('service');

                if (!provider) throw Errors.notFound('Service provider not found.');

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

                const body = {
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
                    reviews: {
                        total: 4.5,
                        data: data,
                    },
                }



                return response.status(200).json(body);

            }

            const providers = await Provider.find().populate('user').populate('service');

            if (!providers) throw Errors.notFound('Service providers not found.');

            const body = await Promise.all(providers.map(async (provider) => {

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
            const provider = await Provider.findById(request.params.id);

            if (!provider) throw Errors.notFound('Service provider not found.');

            if (request.body.user) provider.user = request.body.user;

            if (request.body.service) provider.service = request.body.service;

            if (request.body.price) provider.price = request.body.price;

            if (request.body.description) provider.description = request.body.description;

            const user = await User.findOne({ _id: provider.user, role: ROLE.PROVIDER });

            if (!user) throw Errors.notFound('User not found');

            const service = await Service.findById(provider.service);

            if (!service) throw Errors.notFound('Service not found');

            await provider.save();

            const body = {
                id: provider._id,
                price: provider.price,
                description: provider.description,
                user: {
                    id: user._id,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    email: user.email,
                    role: user.role,
                    created_at: user.createdAt,
                    updated_at: user.updatedAt,
                },
                service: {
                    id: service._id,
                    name: service.name
                }
            }

            return response.status(200).json(body);

        } catch (error) {
            next(error);
        }
    },

    delete: async (request: Request, response: Response, next: NextFunction) => {
        try {
            const provider = await Provider.findById(request.params.id);

            if (!provider) throw Errors.notFound('Service provider not found.');

            await provider.remove();

            response.status(204).send();

        } catch (error) {
            next(error);
        }
    }
}