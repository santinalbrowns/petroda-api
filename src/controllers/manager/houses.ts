import { NextFunction, Request, Response } from "express";
import { ROLE } from "../../enum";
import { Errors } from "../../helpers";
import House from "../../models/House";
import User from "../../models/User";

export const houses = {
    add: async (request: Request, response: Response, next: NextFunction) => {
        try {

            const result = await House.findOne({number: request.body.number});

            if(result) throw Errors.conflict("House number already exists");
            
            const house = await House.create({
                number:request.body.number,
                address: request.body.address,
                city: request.body.city,
                country: request.body.country
            });

            const body = {
                id: house._id,
                number: house.number,
                address: house.address,
                city: house.city,
                country: house.country
            };

            return response.status(201).json(body);
            
        } catch (error) {
            next(error);
        }
    },

    get: async (request: Request, response: Response, next: NextFunction) => {
        try {

            if(request.params.id) {

                const house = await House.findById(request.params.id);

                if(!house) throw Errors.notFound("House not found");

                const body = {
                    id: house._id,
                    number: house.number,
                    address: house.address,
                    city: house.city,
                    country: house.country
                };

                return response.status(200).json(body);

            }

            const houses = await House.find();

            const body = houses.map((house) => {
                return {
                    id: house._id,
                    number: house.number,
                    address: house.address,
                    city: house.city,
                    country: house.country
                }
            });

            return response.status(200).json(body);
            
        } catch (error) {
            next(error);
        }
    },

    update: async (request: Request, response: Response, next: NextFunction) => {
        try {

            const house = await House.findById(request.params.id);

            if(!house) throw Errors.notFound("House not found");

            if(request.body.number && request.body.number.toString() != house.number.toString()) {

                const check = await House.findOne({number: request.body.number});

                if(check) {
                    throw Errors.conflict("House number already exists");
                }

                house.number = request.body.number;
            };

            if(request.body.address) house.address = request.body.address;

            if(request.body.city) house.city = request.body.city;

            if(request.body.country) house.country = request.body.country;

            await house.save();

            const body = {
                id: house._id,
                number: house.number,
                address: house.address,
                city: house.city,
                country: house.country
            };

            return response.status(200).json(body);
            
        } catch (error) {
            next(error);
        }
    },

    delete: async (request: Request, response: Response, next: NextFunction) => {
        try {

            const house = await House.findById(request.params.id);

            if(!house) throw Errors.notFound('House not found');

            await house.remove();

            return response.status(204).send();
            
        } catch (error) {
            next(error);
        }
    }
}