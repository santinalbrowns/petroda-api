import { House } from "./House";
import { User } from "./User";

export interface Tenant {
    [x: string]: any;
    house: House['_id'];
    user: User['_id'];
}