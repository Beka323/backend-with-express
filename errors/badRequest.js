import CustomError from "./customError.js";
import { StatusCodes } from "http-status-codes";
// badeRequest error class
class BadRequest extends CustomError {
    constructor(message) {
        super(message);
        this.statusCode = StatusCodes.BAD_REQUEST;
    }
}
export default BadRequest;
