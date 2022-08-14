import { number, object, string } from "yup";

const provider = {
    add: object({
        price: number().required().min(0),
        service: string().required(),
        description: string().required(),
        user: string().required(),
    }),
    update: object({
        price: number().notRequired().min(0),
        service: string().notRequired(),
        description: string().notRequired(),
        user: string().notRequired(),
    })
}

export default provider;