import { object, string } from "yup";

const registerSchema = object({
    password: string().min(8).required(),
    email: string().email().required().max(255),
    lastname: string().required().min(3).max(45),
    firstname: string().required().min(3).max(45),
});

const loginSchema = object({
    password: string().required(),
    email: string().email().required().max(255),
});

export {
    registerSchema,
    loginSchema,
};