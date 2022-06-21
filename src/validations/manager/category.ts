import { object, string } from "yup";

const category = {
    add: object({
        description: string().required().max(255),
        name: string().min(4).max(40).required()
    }),
    update: object({
        description: string().notRequired().max(255),
        name: string().min(4).max(40).notRequired(),
        id: string().required()
    })
}

export default category;