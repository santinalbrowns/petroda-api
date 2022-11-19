import { NextFunction, Request, Response } from "express";
import { STATUS } from "../../enum";
import { Errors } from "../../helpers";
import Booking from "../../models/Booking";
import House from "../../models/House";
import Provider from "../../models/Provider";
import Tenant from "../../models/Tenant";
import User from "../../models/User";

const requests = {
    get: async (request: Request, response: Response, next: NextFunction) => {
        try {

            if(request.params.id) {

                const booking = await Booking.findById(request.params.id).populate('tenant');

                if(!booking) throw Errors.notFound("Booking not found");

                const provider = await Provider.findOne({_id: booking.provider, user: response.locals.user.id}).populate('service');

                if(!provider) throw Errors.notFound("Booking not found");

                const user = await User.findById(booking.tenant.user);

                const house = await House.findById(booking.tenant.house);

                const body = {
                    id: booking.id,
                    date: booking.date,
                    total: booking.total,
                    status: booking.status,
                    service: {
                        id: provider.service.id,
                        name: provider.service.name,
                    },
                    tenant: {
                        id: user?.id,
                        firstname: user?.firstname,
                        lastname: user?.lastname,
                        email: user?.email,
                    },
                    house: {
                        id: house?.id,
                        address: house?.address,
                        city: house?.city,
                        country: house?.country,
                    },
                    created_at: booking.createdAt,
                    updated_at: booking.updatedAt,
                }

                return response.status(200).json(body);
            }

            const providers = await Provider.find({ user: response.locals.user.id });

            const ids = providers.map(provider => provider.id);

            const results = await Booking.find({ provider: ids }).populate('tenant');

            const data = await Promise.all(results.map(async (booking) => {

                const user = await User.findById(booking.tenant.user);

                const house = await House.findById(booking.tenant.house);

                const provider = await Provider.findById(booking.provider).populate('service');

                return {
                    id: booking.id,
                    date: booking.date,
                    total: booking.total,
                    status: booking.status,
                    service: {
                        id: provider?.service.id,
                        name: provider?.service.name,
                    },
                    tenant: {
                        id: user?.id,
                        firstname: user?.firstname,
                        lastname: user?.lastname,
                        email: user?.email,
                    },
                    house: {
                        id: house?.id,
                        address: house?.address,
                        city: house?.city,
                        country: house?.country,
                    },
                    created_at: booking.createdAt,
                    updated_at: booking.updatedAt,
                }
            }));

            response.status(200).json(data)

        } catch (error) {
            next(error);
        }
    },

    update: async (request: Request, response: Response, next: NextFunction) => {
        try {

            const booking = await Booking.findById(request.params.id).populate('tenant');

            if(!booking) throw Errors.notFound("Booking not found");

            const provider = await Provider.findOne({_id: booking.provider, user: response.locals.user.id}).populate('service');

            if(!provider) throw Errors.notFound("Booking not found");

            const user = await User.findById(booking.tenant.user);

            if(!user) throw Errors.badRequest("Tenant not found");

            const house = await House.findById(booking.tenant.house);

            if(!house) throw Errors.badRequest("Tenant is not assigned to any house");


            const status = request.body.status;

            if(status == STATUS.APPROVED) {
                booking.status = STATUS.APPROVED;
            }
            if(status == STATUS.DECLINED) {
                booking.status = STATUS.DECLINED;
            }
            if(status == STATUS.COMPLETED) {
                booking.status = STATUS.COMPLETED;
            }
            if(status == STATUS.INCOMPLETE) {
                booking.status = STATUS.INCOMPLETE;
            }
            if(status == STATUS.PENDING) {
                booking.status = STATUS.PENDING;
            }

            await booking?.save();

            const body = {
                id: booking.id,
                date: booking.date,
                total: booking.total,
                status: booking.status,
                service: {
                    id: provider.service.id,
                    name: provider.service.name,
                },
                tenant: {
                    id: user.id,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    email: user.email,
                },
                house: {
                    id: house.id,
                    address: house.address,
                    city: house.city,
                    country: house.country,
                },
                created_at: booking.createdAt,
                updated_at: booking.updatedAt,
            }

            return response.status(200).json(body);
            
        } catch (error) {
            next(error);
        }
    },
}

export default requests;