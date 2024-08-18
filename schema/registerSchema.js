import Joi from "joi";
//register schema
const registerSchema = Joi.object({
    email: Joi.string().email().required(),
    username: Joi.string().required().min(3).max(10),
    password: Joi.string().required().max(15).min(5)
});

export default registerSchema;
