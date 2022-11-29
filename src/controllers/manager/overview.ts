import { NextFunction, Request, Response } from "express";
import { ROLE } from "../../enum";
import Booking from "../../models/Booking";
import House from "../../models/House";
import Provider from "../../models/Provider";
import Service from "../../models/Service";
import User from "../../models/User";

export async function overview(request: Request, response: Response, next: NextFunction) {

    try {
        const providers = await Provider.find().populate('user').populate('service');

        const tenants = await User.find({ role: ROLE.TENANT });

        const services = await Service.find();

        const houses = await House.find();

        const data = await Booking.aggregate([
            {
                $group: {
                    _id: { month: { $month: "$createdAt" } },
                    total: { $sum: { $toInt: "$total" } }
                }
            },
            { $sort: { _id: 1 } },
            {
                $project: {
                    total: "$total",
                    month: {
                        $arrayElemAt: [
                            [
                                "",
                                "Jan",
                                "Feb",
                                "Mar",
                                "Apr",
                                "May",
                                "Jun",
                                "Jul",
                                "Aug",
                                "Sep",
                                "Oct",
                                "Nov",
                                "Dec",
                            ],
                            "$_id.month",
                        ],
                    },
                },
            },
        ]);

        const body = {
            chart: {
                values: [0, ...data.map(record => record.total)],
                months: ["", ...data.map(record => record.month)],
            },
            services: services.map((service) => {
                return {
                    id: service._id,
                    name: service.name,
                }
            }),
            providers: providers.map((provider) => {
                return {
                    id: provider._id,
                    price: provider.price,
                    user: {
                        id: provider.user._id,
                        firstname: provider.user.firstname,
                        lastname: provider.user.lastname,
                        email: provider.user.email,
                        created_at: provider.user.createdAt,
                        updated_at: provider.user.updatedAt,
                    },
                    service: {
                        id: provider.service._id,
                        name: provider.service.name
                    }
                }
            }),
            tenants: tenants.map((tenant) => {
                return {
                    id: tenant._id,
                    firstname: tenant.firstname,
                    lastname: tenant.lastname,
                    email: tenant.email,
                    created_at: tenant.createdAt,
                    updated_at: tenant.updatedAt,
                }
            }),
            houses: houses.map((house) => {
                return {
                    id: house._id,
                    number: house.number,
                    address: house.address,
                    city: house.city,
                    country: house.country,
                }
            })
        }

        response.status(200).json(body);

    } catch (error) {
        next(error);
    }

}