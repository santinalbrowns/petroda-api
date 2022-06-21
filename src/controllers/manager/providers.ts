import { NextFunction, Request, Response } from "express";
import { ROLE } from "../../enum";
import { Errors } from "../../helpers";
import User from "../../models/User";

export const providers = {
    add: async (request: Request, response: Response, next: NextFunction) => {
        try {

            const { firstname, lastname, email, password } = request.body;

            const result = await User.findOne({ email: email, role: ROLE.PROVIDER });

            if (result) throw Errors.conflict(`Service provider with email (${email}) already exists.`);

            const user = new User({
                firstname: firstname,
                lastname: lastname,
                email: email,
                password: password,
                role: ROLE.PROVIDER
            });

            await user.save();

            const body = {
                id: user._id,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                created_at: user.createdAt,
                updated_at: user.updatedAt,
            }

            response.status(201).json(body);

        } catch (error) {
            next(error);
        }
    },

    get: async (request: Request, response: Response, next: NextFunction) => {
        try {

            const { id } = request.params;

            if (id) {
                const user = await User.findOne({ _id: id, role: ROLE.PROVIDER });

                if (!user) throw Errors.notFound('Service provider not found.');

                const body = {
                    id: user._id,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    email: user.email,
                    created_at: user.createdAt,
                    updated_at: user.updatedAt,
                }

                return response.status(201).json(body);

            }

            const users = await User.find({ role: ROLE.PROVIDER });

            if (!users) throw Errors.notFound('Service providers not found.');

            const body = users.map((user) => {
                return {
                    id: user._id,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    email: user.email,
                    created_at: user.createdAt,
                    updated_at: user.updatedAt,
                }
            });

            return response.status(201).json(body);

        } catch (error) {
            next(error);
        }
    },

    update: async (request: Request, response: Response, next: NextFunction) => {
        try {

            const { id, firstname, lastname, email, password } = request.body;

            const user = await User.findById(id);

            if(!user) throw Errors.notFound('Service provider not found.');

            if(firstname) user.firstname = firstname;

            if(lastname) user.lastname = lastname;

            if(email) user.email = email;

            if(password) user.password = password;

            await user.save();

            const body = {
                id: user._id,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                created_at: user.createdAt,
                updated_at: user.updatedAt,
            }

            return response.status(200).json(body);

        } catch (error) {
            next(error);
        }
    },

    delete: async (request: Request, response: Response, next: NextFunction) => {
        try {

            const { id } = request.params;

            const user = await User.findById(id);

            if(!user) throw Errors.notFound('Service provider not found.');

            await user.remove();

            response.status(204).send();

        } catch (error) {
            next(error);
        }
    }
}