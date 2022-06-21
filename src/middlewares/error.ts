import { Request, Response, NextFunction } from "express";

import Errors from "../helpers/errors";

export default function error(error: any, request: Request, response: Response, next: NextFunction) {

    if (error instanceof Errors) {
        return response.status(error.code).json({
            code: error.code,
            message: error.message,
        });
    }

    console.log(error.message);

    return response.status(500).json({
        code: 500,
        message: 'something went wrong'
    });
}