import Joi from "joi";
//Login schema
const loginSchema = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required().max(15).min(5)
});
export default loginSchema;
