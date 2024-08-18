import "dotenv/config";
import jwt from "jsonwebtoken";
import UnauthorizedError from "../errors/unAuthorizedError.js";
function verifyToken(req, res, next) {
    const headers = req.headers.authorization || req.headers.Authorization;
    if (!headers || !headers.startsWith("Bearer ")) {
      //  console.log("Error found in verifyToken");
        throw new UnauthorizedError("unauthorized user");
    }
    const token = headers.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN);
    req.user = decodedToken;
    next();
}
export default verifyToken;
