import { NextFunction, Request, Response } from "express";
import { Errors } from "../../helpers";
import Category from "../../models/Category";

import Service from "../../models/Service";
import User from "../../models/User";

export const services = {
    add: async (request: Request, response: Response, next: NextFunction) => {
        try {
            const category = await Category.findById(request.body.category);

            if (!category) throw Errors.notFound('Category not found.');

            const service = await Service.create({
                name: request.body.name,
                category: category._id,
            });

            const body = {
                id: service._id,
                name: service.name,
                category: {
                    id: category._id,
                    name: category.name,
                    description: category.description
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

                const service = await Service.findById(request.params.id).populate('category').populate('user');

                if (!service) throw Errors.notFound('Service not found.');

                const body = {
                    id: service._id,
                    price: service.price,
                    hours: service.hours,
                    category: {
                        id: service.category._id,
                        name: service.category.name,
                        description: service.category.description
                    },
                    provider: {
                        id: service.user._id,
                        firstname: service.user.firstname,
                        lastname: service.user.lastname,
                        email: service.user.email
                    }
                }

                return response.status(200).json(body);
            }


            const services = await Service.find().populate('category').populate('user');

            if (!services) throw Errors.notFound('Services not found.');

            const body = services.map(service => {
                return {
                    id: service._id,
                    price: service.price,
                    hours: service.hours,
                    category: {
                        id: service.category._id,
                        name: service.category.name,
                        description: service.category.description
                    },
                    provider: {
                        id: service.user._id,
                        firstname: service.user.firstname,
                        lastname: service.user.lastname,
                        email: service.user.email
                    }
                }
            });

            return response.status(200).json(body);


        } catch (error) {
            next();
        }
    },

    update: async (request: Request, response: Response, next: NextFunction) => {

        try {

            const { id, name, price, hours, category: categoryId, user: userId } = request.body;

            const service = await Service.findById(id).populate('category').populate('user');

            if (!service) throw Errors.notFound("Service not found.");



            if (name) service.name = name;

            if (price) service.price = price;

            if (hours) service.hours = hours;

            if (categoryId) {

                const category = await Category.findById(categoryId);

                if (!category) throw Errors.notFound("Category not found.");

                service.category = categoryId;
            }

            if (userId) {

                const user = await User.findById(userId);

                if (!user) throw Errors.notFound("Service provider not found.");

                service.user = userId
            };

            await service.save();

            const body = {
                id: service._id,
                price: service.price,
                hours: service.hours,
                category: {
                    id: service.category._id,
                    name: service.category.name,
                    description: service.category.description
                },
                provider: {
                    id: service.user._id,
                    firstname: service.user.firstname,
                    lastname: service.user.lastname,
                    email: service.user.email
                }
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