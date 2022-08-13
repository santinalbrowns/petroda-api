import { NextFunction, Request, Response } from "express";
import { ROLE } from "../../enum";
import House from "../../models/House";
import Provider from "../../models/Provider";
import Service from "../../models/Service";
import User from "../../models/User";

export async function overview(request: Request, response: Response, next: NextFunction) {

    try {
        const providers = await Provider.find().populate('user').populate('service');

        const tenants = await User.find({ role: ROLE.TENANT });

        const services = await Service.find().populate('category');

        const houses = await House.find().populate('tenant');

        const body = {
            services: services.map((service) => {
                return {
                    id: service._id,
                    name: service.name,
                }
            }),
            providers: providers.map((provider) => {
                return {
                    id: provider._id,
                    price: provider.price,
                    user: {
                        id: provider.user._id,
                        firstname: provider.user.firstname,
                        lastname: provider.user.lastname,
                        email: provider.user.email,
                        created_at: provider.user.createdAt,
                        updated_at: provider.user.updatedAt,
                    },
                    service: {
                        id: provider.service._id,
                        name: provider.service.name
                    }
                }
            }),
            tenants: tenants.map((tenant) => {
                return {
                    id: tenant._id,
                    firstname: tenant.firstname,
                    lastname: tenant.lastname,
                    email: tenant.email,
                    created_at: tenant.createdAt,
                    updated_at: tenant.updatedAt,
                }
            }),
            houses: houses.map((house) => {
                return {
                    id: house._id,
                    number: house.number,
                    address: house.address,
                    city: house.city,
                    country: house.country,
                    tenant: {
                        id: house.tenant._id,
                        firstname: house.tenant.firstname,
                        lastname: house.tenant.lastname,
                        email: house.tenant.email,
                        created_at: house.tenant.createdAt,
                        updated_at: house.tenant.updatedAt,
                    }
                }
            })
        }

        response.status(200).json(body);

    } catch (error) {
        next(error);
    }

}