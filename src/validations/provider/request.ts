import { object, string } from "yup";

const request = {
    update: object({
        status: string().required()
    }),
}

export default request;


