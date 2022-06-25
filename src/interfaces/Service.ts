import { Category } from "./Category";
import { User } from "./User";

export interface Service {
    [x: string]: any;
    name: string;
    category: Category['_id'];
}