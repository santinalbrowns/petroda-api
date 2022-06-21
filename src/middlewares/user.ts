import { NextFunction, Request, Response } from "express";
import { get } from "lodash";
import { Verify } from "../helpers";

export async function deserialize(request: Request, response: Response, next: NextFunction) {
    const token = get(request, 'headers.authorization', '').replace('Bearer', '').trim();

    if (!token) return next();

    const { payload } = Verify(token);

    if (payload) {
        response.locals.user = payload;
    }

    return next();
}