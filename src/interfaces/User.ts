import { ROLE } from "../enum/ROLE";

export interface User {
    [x: string]: any;
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    role: ROLE;
}