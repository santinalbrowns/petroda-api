import { NextFunction, Request, Response } from "express";
import { Errors } from "../../helpers";
import Category from "../../models/Category";

export const categories = {
    add: async (request: Request, response: Response, next: NextFunction) => {

        try {
            const result = await Category.findOne({ name: request.body.name });

            if (result) throw Errors.conflict(`Category name (${request.body.name}) already exists.`);

            const category = await Category.create({ name: request.body.name });

            return response.status(201).json({
                id: category._id,
                name: category.name,
            })

        } catch (error) {
            next(error);
        }

    },

    get: async (request: Request, response: Response, next: NextFunction) => {
        try {
            if (request.params.id) {
                const category = await Category.findById(request.params.id);

                if (!category) throw Errors.notFound('Category not found.');

                return response.status(200).json({
                    id: category._id,
                    name: category.name,
                });
            }

            const categories = await Category.find();

            if (!categories) throw Errors.notFound('Categories not found.');

            const body = categories.map((category) => {
                return {
                    id: category._id,
                    name: category.name,
                }
            });

            return response.status(200).json(body);

        } catch (error) {
            next(error);
        }
    },

    update: async (request: Request, response: Response, next: NextFunction) => {
        try {
            const category = await Category.findById(request.body.id);

            if (!category) throw Errors.notFound('Category not found');

            if (request.body.name) category.name = request.body.name;

            await category.save();

            return response.status(200).json({
                id: category._id,
                name: category.name,
            });

        } catch (error) {
            next(error);
        }
    },

    delete: async (request: Request, response: Response, next: NextFunction) => {
        try {
            const category = await Category.findById(request.params.id);

            if (!category) throw Errors.notFound('Category not found.');

            await category.remove();

            response.status(204).send();

        } catch (error) {
            next(error);
        }
    }
}