import { NextFunction, Request, Response } from "express";
import { ROLE } from "../../enum/ROLE";
import { Errors, Sign } from "../../helpers";
import User from "../../models/User";

export async function register(request: Request, response: Response, next: NextFunction) {
    try {

        const { firstname, lastname, email, password } = request.body;

        const result = await User.findOne({ email: email });

        if (result) throw Errors.conflict(`User with email (${email}) already exists.`);

        const user = new User({
            firstname: firstname,
            lastname: lastname,
            email: email,
            password: password,
            role: ROLE.TENANT
        });

        await user.save();

        const body = {
            id: user._id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            role: user.role,
            created_at: user.createdAt,
            updated_at: user.updatedAt,
        }

        response.status(201).json(body);

    } catch (error) {
        next(error)
    }
}

export async function login(request: Request, response: Response, next: NextFunction) {

    try {

        const { email, password } = request.body;

        const user = await User.findOne({email: email});

        if(!user) throw Errors.badRequest('Invalid credentials');

        /* * 
         * Compare the provided password with the database password
         * and returns true if the password matched otherwise returns false
         * */
        const valid = await user.comparePassword(password);

        if(!valid) throw Errors.badRequest('Invalid credentials');

        /**
         * Assign access token only to authenticated user and set its expiration time
         */
        const token = Sign({id: user._id}, {expiresIn: process.env.TOKEN_LIFETIME});

        const body = {
            id: user._id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            role: user.role,
            token: token,
            created_at: user.createdAt,
            updated_at: user.updatedAt,
        }

        response.status(200).json(body);

    } catch (error) {
        next(error);
    }

}