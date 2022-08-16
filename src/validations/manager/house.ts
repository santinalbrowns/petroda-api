import { number, object, string } from "yup";

const house = {
    add: object({
        country: string().required().min(2),
        city: string().required().min(3),
        address: string().required().min(3),
        number: number().min(0).required(),
    }),
    update: object({
        country: string().notRequired().min(2),
        city: string().notRequired().min(3),
        address: string().notRequired().min(3),
        number: number().min(0).notRequired()
    })
}

export default house;