class Errors {

    message: any;
    code: number;
    
    constructor(code: number, message: any) {
        this.message = message;
        this.code = code;
    }

    static unauthorized(message: any) {
        return new Errors(401, message);
    }

    static notFound(message: any) {
        return new Errors(404, message);
    }

    static conflict(message: any) {
        return new Errors(409, message);
    }

    static badRequest(message: any) {
        return new Errors(400, message);
    }

    static internalServerError(message: any) {
        return new Errors(500, message);
    }

    static badGateway(message: any) {
        return new Errors(502, message);
    }

    static serviceUnavailable(message: any) {
        return new Errors(503, message);
    }

    static notImplemented(message: any) {
        return new Errors(501, message);
    }

    static notAcceptable(message: any) {
        return new Errors(406, message);
    }

    static unsupportedMediaType(message: any) {
        return new Errors(415, message);
    }

    static tooManyRequests(message: any) {
        return new Errors(429, message);
    }

    static methodNotAllowed(message: any) {
        return new Errors(405, message);
    }

    static unprocessableEntity(message: any) {
        return new Errors(422, message);
    }

    static forbidden(message: any) {
        return new Errors(403, message);
    }
}

export default Errors;