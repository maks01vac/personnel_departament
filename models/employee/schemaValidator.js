const joi = require('joi');

exports.validateSchema = (data) => {
    const schema = joi.object({
        firstname:joi.string().min(3).max(20).required(),
        lastname:joi.string().min(3).max(20).required(),
        sex:joi.string().max(1).required(),
        birthdate:joi.date().required(),
        phone:joi.string().min(2).max(15).required(),
    })
    return schema.validate(data);
}