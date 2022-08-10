import { NextFunction, Request, Response } from "express";
import { ROLE } from "../../enum";
import { Errors } from "../../helpers";
import House from "../../models/House";
import Tenant from "../../models/Tenant";
import User from "../../models/User";

export const tenants = {
    add: async (request: Request, response: Response, next: NextFunction) => {
        try {

            const house = await House.findOne({ number: request.body.house });

            if (!house) {
                throw Errors.notFound("House not found.");
            }

            const user = await User.findOne({ email: request.body.email, role: ROLE.TENANT });

            if (!user) {
                throw Errors.notFound("Tenant not found.");
            }

            const result = await Tenant.findOne({ user: user._id });

            if (result) {
                throw Errors.conflict("Tenant already has a house");
            }

            const houseResult = await Tenant.findOne({ house: house._id });

            if (houseResult) {
                throw Errors.conflict("House already has a tenant");
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

                const tenant = await User.findOne({ _id: request.params.id, role: ROLE.TENANT });

                if (!tenant) throw Errors.notFound('Tenant not found.');

                return response.status(200).json({
                    id: tenant._id,
                    firstname: tenant.firstname,
                    lastname: tenant.lastname,
                    email: tenant.email,
                    created_at: tenant.createdAt,
                    updated_at: tenant.updatedAt
                });

            }

            const tenants = await User.find({ role: ROLE.TENANT });


            if (!tenants) throw Errors.notFound('Tenants not found.');


            const body = tenants.map((tenant) => {

                return {
                    id: tenant._id,
                    firstname: tenant.firstname,
                    lastname: tenant.lastname,
                    email: tenant.email,
                    created_at: tenant.createdAt,
                    updated_at: tenant.updatedAt
                }
            })


            return response.status(200).json(body);


        } catch (error) {
            next(error);
        }

    }
}

