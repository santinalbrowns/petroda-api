import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const privateKey: any = process.env.PRIVATE_KEY;
const publicKey: any = process.env.PUBLIC_KEY;

export function sign(object: Object, options?: jwt.SignOptions | undefined) {
    return jwt.sign(object, privateKey, {
        ...(options && options),
        algorithm: 'RS256'
    });
}

export function verify(token: string) {
    try {
        const payload = jwt.verify(token, publicKey);

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