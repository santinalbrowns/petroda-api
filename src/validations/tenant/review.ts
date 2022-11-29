import { number, object, string } from "yup";

const rate = object({
    rate: number().min(0).max(5).required(),
    comment: string().notRequired(),
})

export default rate;