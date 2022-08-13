import { STATUS } from "../enum";
import { Provider } from "./Prodiver";
import { Tenant } from "./Tenant";

export interface Booking {
    [x: string]: any;
    date: Date;
    total: number;
    status: STATUS;
    provider: Provider['_id'];
    tenant: Tenant['_id'];
}