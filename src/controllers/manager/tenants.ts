import { NextFunction, Request, Response } from "express";
import { ROLE } from "../../enum";
import { Errors } from "../../helpers";
import User from "../../models/User";

export const tenants = {
    get: async (request: Request, response: Response, next: NextFunction) => {

        try {

            if (request.params.id) {


                const tenant = await User.findOne({ _id: request.params.id, role: ROLE.TENANT });

                if (!tenant) throw Errors.notFound('Tenant not found.');

                response.status(200).json({
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


            response.status(200).json(body);


        } catch (error) {
            next(error);
        }

    }
}

