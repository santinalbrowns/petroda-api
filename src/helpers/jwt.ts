import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const SECRET_KEY: any = process.env.SECRET_KEY;

export function sign(object: Object, options?: jwt.SignOptions | undefined) {
    try {
        return jwt.sign(object, SECRET_KEY);
    } catch (error) {
        console.log("RSA Key failed");
    }
}

export function verify(token: string) {
    try {
        const payload = jwt.verify(token, SECRET_KEY);

        return {
            valid: true,
            expired: false,
            payload
        }
    } catch (e: any) {
        
        return {
            valid: false,
            expired: e.message === 'jwt expired',
            payload: null
        }
    }
}