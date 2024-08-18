import CustomError from "./customError.js";
import { StatusCodes } from "http-status-codes";
// ConflictError error class
class ConflictError extends CustomError {
    constructor(message) {
        super(message);
        this.statusCode = StatusCodes.CONFLICT;
    }
}
export default ConflictError;
