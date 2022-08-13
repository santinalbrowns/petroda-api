import { NextFunction, Request, Response } from "express";
import { ROLE } from "../../enum";
import { Errors } from "../../helpers";
import House from "../../models/House";
import Tenant from "../../models/Tenant";
import User from "../../models/User";

export const tenants = {
    add: async (request: Request, response: Response, next: NextFunction) => {
        try {

            const house = await House.findById(request.body.house);

            if (!house) {
                throw Errors.notFound("House not found.");
            }

            const user = await User.findOne({ _id: request.body.user, role: ROLE.TENANT });

            if (!user) {
                throw Errors.notFound("Tenant not found.");
            }

            const result = await Tenant.findOne({ user: user._id, house: house._id });

            if (result) {
                throw Errors.conflict("Tenant already has a house");
            }

            const tenant = await Tenant.create({
                house: request.body.house,
                user: request.body.user
            });

            const body = {
                id: tenant._id,
                house: {
                    id: house._id,
                    number: house.number,
                    address: house.address,
                    city: house.city,
                    country: house.country,
                },
                tenant: {
                    id: user._id,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    email: user.email,
                    created_at: user.createdAt,
                    updated_at: user.updatedAt
                },
            }

            response.status(201).json(body);

        } catch (error) {
            next(error);
        }
    },

    get: async (request: Request, response: Response, next: NextFunction) => {

        try {
            if (request.params.id) {

                const tenant = await Tenant.findById(request.params.id).populate('user').populate('house');

                if (!tenant) throw Errors.notFound('Tenant not found.');

                const body = {
                    id: tenant._id,
                    house: {
                        id: tenant.house._id,
                        number: tenant.house.number,
                        address: tenant.house.address,
                        city: tenant.house.city,
                        country: tenant.house.country,
                    },
                    tenant: {
                        id: tenant.user._id,
                        firstname: tenant.user.firstname,
                        lastname: tenant.user.lastname,
                        email: tenant.user.email,
                        created_at: tenant.user.createdAt,
                        updated_at: tenant.user.updatedAt
                    },
                }

                return response.status(200).json(body);

            }

            const tenants = await Tenant.find().populate('user').populate('house');

            if (!tenants) throw Errors.notFound('Tenants not found.');

            const body = tenants.map((tenant: any) => {
                return {
                    id: tenant._id,
                    house: {
                        id: tenant.house._id,
                        number: tenant.house.number,
                        address: tenant.house.address,
                        city: tenant.house.city,
                        country: tenant.house.country,
                    },
                    tenant: {
                        id: tenant.user._id,
                        firstname: tenant.user.firstname,
                        lastname: tenant.user.lastname,
                        email: tenant.user.email,
                        created_at: tenant.user.createdAt,
                        updated_at: tenant.user.updatedAt
                    },
                }
            });

            return response.status(200).json(body);

        } catch (error) {
            next(error);
        }

    },

    update: async (request: Request, response: Response, next: NextFunction) => {
        try {

            const tenant = await Tenant.findById(request.params.id).populate('user').populate('house');

            if (!tenant) throw Errors.notFound('Tenant not found.');



            if (request.body.user) {
                const user = await User.findOne({ _id: request.body.user, role: ROLE.TENANT });

                if (!user) {
                    throw Errors.notFound("Tenant not found.");
                }

                tenant.user = request.body.user;
            };

            if (request.body.house) {
                const house = await House.findById(request.body.house);

                if (!house) {
                    throw Errors.notFound("House not found.");
                }
                tenant.house = request.body.house;
            }

            await tenant.save();

            const body = {
                id: tenant._id,
                house: {
                    id: tenant.house._id,
                    number: tenant.house.number,
                    address: tenant.house.address,
                    city: tenant.house.city,
                    country: tenant.house.country,
                },
                tenant: {
                    id: tenant.user._id,
                    firstname: tenant.user.firstname,
                    lastname: tenant.user.lastname,
                    email: tenant.user.email,
                    created_at: tenant.user.createdAt,
                    updated_at: tenant.user.updatedAt
                },
            }

            response.status(201).json(body);

        } catch (error) {
            next(error);
        }
    },

    delete: async (request: Request, response: Response, next: NextFunction) => {
        try {
            const tenant = await Tenant.findById(request.params.id);

            if (!tenant) throw Errors.notFound("Tenant not found.");

            await tenant.remove();

            return response.status(204).send();

        } catch (error) {
            next(error);
        }
    }
}

