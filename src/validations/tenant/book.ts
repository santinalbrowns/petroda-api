import { date, number, object, string } from "yup";

const book = {
    request: object({
        date: date().required(),
        provider: string().required(),
    }),
}

export default book;