import BadRequest from "../errors/badRequest.js";
function validator(schema) {
    return (req, res, next) => {
        //console.log(req.body)
        const { error, value } = schema.validate(req.body);
        if (error) {
          throw new BadRequest(error.details[0].message);
        }
        req.body = value;
        next();
    };
}
export default validator;
