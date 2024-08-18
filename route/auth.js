import express from "express";
import validator from "../middleware/validator.js";
import registerSchema from "../schema/registerSchema.js";
import loginSchema from "../schema/loginSchema.js";
import { register, login } from "../controller/auth.js";
const authRoute = express.Router();
//Register Route
authRoute.post("/register", validator(registerSchema), register);
//Login Route
authRoute.post("/login", validator(loginSchema), login);
export default authRoute;
