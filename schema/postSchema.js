import Joi from "joi";
//post schema
const postSchema = Joi.object({
    content: Joi.string().max(250).required()
});
export default postSchema;
