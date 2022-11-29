import { NextFunction, Request, Response } from "express";
import { Errors } from "../../helpers";
import Provider from "../../models/Provider";
import Review from "../../models/Review";
import Tenant from "../../models/Tenant";

export async function addReview(request: Request, response: Response, next: NextFunction) {

    try {

        const { rate, comment } = request.body;

        const user = response.locals.user;

        const tenant = await Tenant.findOne({ user: user.id });

        if (!tenant) throw Errors.notFound("Tenant not found");

        const provider = await Provider.findById(request.params.id);

        if (!provider) throw Errors.notFound("Tenant not found");

        const review = await Review.create({
            rate: rate,
            comment: comment,
            provider: provider.id,
            tenant: tenant.id
        });

        response.status(201).json(review);

    } catch (error) {
        next(error);
    }
}

export async function getReviews(request: Request, response: Response, next: NextFunction) {
    try {

        const { id } = request.body;

        const provider = await Provider.findById(id).populate("user");

        if(!provider) throw Errors.notFound("Service provider not found");

        const reviews = await Review.find({provider: provider.id}).populate('tenant');

        const body = await Promise.all(reviews.map(async(review) => {

            const tenant = await Tenant.findById(review.tenant._id).populate("user");

            return {
                id: review._id,
                rate: review.rate,
                comment: review.comment,
                user: {
                    firstname: tenant?.user.firstname,
                    lastname: tenant?.user.firstname,
                },
                date: review.createdAt,
            }

        }));

        const total = 4.6;

        response.status(200).json(body);

    } catch (error) {
        next(error);
    }
}