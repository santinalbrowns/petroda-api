import { NextFunction, Request, Response } from "express";
import { ROLE } from "../../enum";
import Category from "../../models/Category";
import Provider from "../../models/Provider";
import Service from "../../models/Service";
import User from "../../models/User";

export async function overview(request: Request, response: Response, next: NextFunction) {

    try {

        const categories = await Category.find();

        const providers = await Provider.find().populate('user').populate('service');

        const tenants = await User.find({ role: ROLE.TENANT });

        const services = await Service.find().populate('category');

        const body = {
            categories: categories.map((category) => {
                return {
                    id: category._id,
                    name: category.name,
                    description: category.description
                }
            }),
            services: services.map((service) => {
                return {
                    id: service._id,
                    name: service.name,
                    category: {
                        id: service.category._id,
                        name: service.category.name,
                        description: service.category.description
                    }
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
            })
        }

        response.status(200).json(body);

    } catch (error) {
        next(error);
    }

}