import { number, object, string } from "yup";

const provider = {
    add: object({
        price: number().required().min(0),
        service: string().required(),
        user: string().required(),
    }),
    update: object({
        price: number().notRequired().min(0),
        service: string().notRequired(),
        user: string().notRequired(),
        id: string().required()
    })
}

export default provider;