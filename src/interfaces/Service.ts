import { Category } from "./Category";
import { User } from "./User";

export interface Service {
    [x: string]: any;
    price: number;
    category: Category['_id'];
    hours: number;
    user: User['_id'];
}