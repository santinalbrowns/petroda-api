import { object, string } from "yup";

const category = {
    add: object({
        name: string().min(4).max(40).required()
    }),
    update: object({
        name: string().min(4).max(40).notRequired(),
        id: string().required()
    })
}

export default category;