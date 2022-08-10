import { number, object, string } from "yup";

const service = {
    add: object({
        name: string().required().min(3).max(45),
    }),
    update: object({
        name: string().notRequired().min(3).max(45)
    })
}

export default service;