const joi = require('joi');

exports.validateSchema = (data) => {
    const schema = joi.object({
        name:joi.string().min(3).max(30).required(),
    })
    return schema.validate(data);
}