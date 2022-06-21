import { NextFunction, Request, Response } from "express";
import { ROLE } from "../../enum";
import Category from "../../models/Category";
import Service from "../../models/Service";
import User from "../../models/User";

export async function overview(request:Request, response: Response, next: NextFunction) {

    try {

        const categories = await Category.find();

        const providers = await User.find({role: ROLE.PROVIDER});

        const services = await Service.find().populate('category').populate('user');

        const body = {
            categories: categories.map((category) => {
                return {
                    id: category._id,
                    name: category.name,
                    description: category.description
                }
            }),
            providers: providers.map((user) => {
                return {
                    id: user._id,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    email: user.email,
                    created_at: user.createdAt,
                    updated_at: user.updatedAt,
                }
            }),
            services: services.map((service) => {
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
                        email: service.user.email,
                        created_at: service.user.createdAt,
                        updated_at: service.user.updatedAt,
                    }
                }
            })

        }

        response.status(200).json(body);

    } catch (error) {
        next(error);
    }
    
}