import { NextFunction, Request, Response } from "express";
import errors from "../helpers/errors";

const validate = (schema: any) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {

            const body = await schema.validate(req.body);

            req.body = body;

            next();

        } catch (error: any) {

            next(errors.badRequest(error.message));

        }
    }
}

export default validate;