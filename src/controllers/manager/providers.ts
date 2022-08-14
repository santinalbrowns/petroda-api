import { NextFunction, Request, Response } from "express";
import { ROLE } from "../../enum";
import { Errors } from "../../helpers";
import Provider from "../../models/Provider";
import Service from "../../models/Service";
import User from "../../models/User";

export const providers = {
    add: async (request: Request, response: Response, next: NextFunction) => {
        try {

            const user = await User.findOne({ _id: request.body.user, role: ROLE.PROVIDER });

            if (!user) throw Errors.notFound('User not found');

            const service = await Service.findById(request.body.service);

            if (!service) throw Errors.notFound('Service not found');

            const provider = new Provider({
                user: user._id,
                service: service._id,
                price: request.body.price
            });

            await provider.save();

            const body = {
                id: provider._id,
                price: provider.price,
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

                const body = {
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

                return response.status(201).json(body);

            }

            const providers = await Provider.find().populate('user').populate('service');

            if (!providers) throw Errors.notFound('Service providers not found.');

            const body = providers.map((provider) => {
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
            });

            return response.status(201).json(body);

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

            const user = await User.findOne({ _id: provider.user, role: ROLE.PROVIDER });

            if (!user) throw Errors.notFound('User not found');

            const service = await Service.findById(provider.service);

            if (!service) throw Errors.notFound('Service not found');

            await provider.save();

            const body = {
                id: provider._id,
                price: provider.price,
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