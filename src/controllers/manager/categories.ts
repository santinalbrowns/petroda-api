import { NextFunction, Request, Response } from "express";
import { Errors } from "../../helpers";
import Category from "../../models/Category";

export const categories = {
    add: async (request: Request, response: Response, next: NextFunction) => {

        try {
            const { name, description } = request.body;

            const result = await Category.findOne({ name: name });

            if (result) throw Errors.conflict(`Category name (${name}) already exists.`);

            const category = await Category.create({ name: name, description: description });

            return response.status(201).json({
                id: category._id,
                name: category.name,
                description: category.description
            })

        } catch (error) {
            next(error);
        }

    },

    get: async (request: Request, response: Response, next: NextFunction) => {
        try {

            const { id } = request.params;

            if (id) {
                const category = await Category.findById(id);

                if (!category) throw Errors.notFound('Category not found.');

                return response.status(200).json({
                    id: category._id,
                    name: category.name,
                    description: category.description
                });
            }

            const categories = await Category.find();

            if (!categories) throw Errors.notFound('Categories not found.');

            const body = categories.map((category) => {
                return {
                    id: category._id,
                    name: category.name,
                    description: category.description
                }
            });

            return response.status(200).json(body);

        } catch (error) {
            next(error);
        }
    },

    update: async (request: Request, response: Response, next: NextFunction) => {
        try {
            const { id, name, description } = request.body;

            const category = await Category.findById(id);

            if (!category) throw Errors.notFound('Category not found');

            if (name) category.name = name;

            if (description) category.description = description;

            await category.save();

            return response.status(200).json({
                id: category._id,
                name: category.name,
                description: category.description
            });

        } catch (error) {
            next(error);
        }
    },

    delete: async (request: Request, response: Response, next: NextFunction) => {
        try {

            const { id } = request.params;

            const category = await Category.findById(id);

            if(!category) throw Errors.notFound('Category not found.');

            await category.remove();

            response.status(204).send();

        } catch (error) {
            next(error);
        }
    }
}