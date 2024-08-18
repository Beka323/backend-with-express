import CustomError from "./customError.js";
import { StatusCodes } from "http-status-codes";
//unauthorized error class
class UnauthorizedError extends CustomError {
    constructor(message) {
        super(message);
        this.statusCode = StatusCodes.UNAUTHORIZED;
    }
}
export default UnauthorizedError;
