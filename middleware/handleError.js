import CustomError from "../errors/customError.js";
import { StatusCodes } from "http-status-codes";
function handleError(err, req, res, next) {
    if (err instanceof CustomError) {
        return res.status(err.statusCode).json({ msg: err.message });
    }
    console.log(err.stack);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        msg: "Something is wrong"
    });
}
export default handleError;
