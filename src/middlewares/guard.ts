import { NextFunction, Request, Response } from "express";
import { ROLE } from "../enum";
import { Errors } from "../helpers";
import User from "../models/User";

export function guard(title: ROLE) {
    return async (request: Request, response: Response, next: NextFunction) => {
        const client = response.locals.user;

        if(!client) {
            return next(Errors.unauthorized("You are not authorized to access this resource"));
        }

        const user = await User.findById(client.id);

        if (!user) {
            return next(Errors.unauthorized("You are not authorized to access this resource"));
        }

        if(user.role !== title) return next(Errors.forbidden("Forbiden, user not allowed"));

        return next();
    }
}