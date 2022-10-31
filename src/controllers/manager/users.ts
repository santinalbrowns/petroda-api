import { NextFunction, Request, Response } from "express";
import { ROLE } from "../../enum";
import { Errors } from "../../helpers";
import User from "../../models/User";

export const users = {
    add: async (request: Request, response: Response, next: NextFunction) => {
        try {

            const result = await User.findOne({ email: request.body.email });

            if (result) throw Errors.conflict('User already exists');

            const user = await User.create({
                firstname: request.body.firstname,
                lastname: request.body.lastname,
                email: request.body.email,
                role: request.body.role,
                password: request.body.password
            });

            const body = {
                id: user._id,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                role: user.role,
                created_at: user.createdAt,
                updated_at: user.updatedAt
            };

            response.status(201).json(body);


        } catch (error) {
            next(error);
        }
    },

    get: async (request: Request, response: Response, next: NextFunction) => {
        try {

            if (request.params.id) {
                const user = await User.findById(request.params.id);

                if (!user) throw Errors.notFound("User not found");

                const body = {
                    id: user._id,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    email: user.email,
                    role: user.role,
                    created_at: user.createdAt,
                    updated_at: user.updatedAt
                };

                return response.status(201).json(body);
            }

            let role = null;

            if(request.query.role && request.query.role == ROLE.TENANT) {
                role = ROLE.TENANT;
            }

            if(request.query.role && request.query.role == ROLE.MANAGER) {
                role = ROLE.MANAGER;
            }

            if(request.query.role && request.query.role == ROLE.PROVIDER) {
                role = ROLE.PROVIDER;
            }

            const users = role ? await User.find({role: role}) : await User.find();

            if (!users) throw Errors.notFound("Users not found");

            const body = users.map((user) => {
                return {
                    id: user._id,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    email: user.email,
                    role: user.role,
                    created_at: user.createdAt,
                    updated_at: user.updatedAt
                }
            });

            return response.status(201).json(body);


        } catch (error) {
            next(error);
        }
    },

    update: async (request: Request, response: Response, next: NextFunction) => {
        try {

            const user = await User.findById(request.params.id);

            if (!user) throw Errors.notFound("User not found");

            if(request.body.firstname) user.firstname = request.body.firstname;

            if(request.body.lastname) user.lastname = request.body.lastname;

            if(request.body.email) user.email = request.body.email;

            if(request.body.password) user.password = request.body.password;

            if(request.body.role) user.role = request.body.role;

            await user.save();

            const body = {
                id: user._id,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                role: user.role,
                created_at: user.createdAt,
                updated_at: user.updatedAt
            };

            response.status(201).json(body);
            
        } catch (error) {
            next(error);
        }
    },

    delete: async (request: Request, response: Response, next: NextFunction) => {
        try {

            const user = await User.findById(request.params.id);

            if(!user) throw Errors.notFound("User not found");

            await user.remove();

            response.status(204).send();
            
        } catch (error) {
            next(error);
        }
    }
}