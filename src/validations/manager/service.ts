import { number, object, string } from "yup";

const service = {
    add: object({
        category: string().required(),
        name: string().required().min(3).max(45),
    }),
    update: object({
        category: string().notRequired(),
        name: string().notRequired().min(3).max(45),
        id: string().required()
    })
}

export default service;