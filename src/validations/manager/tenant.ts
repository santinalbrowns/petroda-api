import { object, string } from "yup";

const tenant = {
    add: object({
        house: string().required(),
        user: string().required(),        
    }),
    update: object({
        house: string().notRequired(),
        user: string().notRequired(),
    })
}

export default tenant;