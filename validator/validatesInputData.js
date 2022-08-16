const joi = require('joi');

const validatesInputData = {};

validatesInputData.employeesSchema = (data) => {
    const schema = joi.object({
        firstname:joi.string().min(3).max(20).required(),
        lastname:joi.string().min(3).max(20).required(),
        sex:joi.string().max(1).required(),
        birthdate:joi.date().required(),
        phone:joi.string().min(2).max(15).required(),
    })
    return schema.validate(data);
}

validatesInputData.isNumber = (Number) =>{
    const validatesNumber = joi.number().integer().required();
    return validatesNumber.validate(Number);
}

module.exports = validatesInputData