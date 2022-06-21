import { object, string } from "yup";

const provider = {
    add: object({
        password: string().min(8).required(),
        email: string().email().required().max(255),
        lastname: string().required().min(3).max(45),
        firstname: string().required().min(3).max(45),
    }),
    update: object({
        password: string().min(8).notRequired(),
        email: string().email().notRequired().max(255),
        lastname: string().notRequired().min(3).max(45),
        firstname: string().notRequired().min(3).max(45),
        id: string().required()
    })
}

export default provider;