import { Service } from "./Service";
import { User } from "./User";

export interface Provider {
    [x: string]: any;
    user: User['_id'];
    service: Service['_id'];
    price: number;
    description: string;
}