import { number, object, string } from "yup";

const service = {
    add: object({
        user: string().required(),
        category: string().required(),
        hours: number().required().min(0),
        price: number().required().min(0),
        name: string().required().min(3).max(45),
    }),
    update: object({
        user: string().notRequired(),
        category: string().notRequired(),
        hours: number().notRequired().min(0),
        price: number().notRequired().min(0),
        name: string().notRequired().min(3).max(45),
        id: string().required()
    })
}

export default service;