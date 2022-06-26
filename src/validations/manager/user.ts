import { number, object, string } from "yup";

const user = {
    add: object({
        password: string().required().min(8),
        role: string().required(),
        email: string().email().required(),
        lastname: string().required().min(3).max(45),
        firstname: string().required().min(3).max(45),
        
    }),
    update: object({
        password: string().notRequired().min(8),
        role: string().notRequired(),
        email: string().email().notRequired(),
        lastname: string().notRequired().min(3).max(45),
        firstname: string().notRequired().min(3).max(45),
        id: string().required()
    })
}

export default user;