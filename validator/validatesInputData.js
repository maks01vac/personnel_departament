const joi = require('joi');

const validatesInputData = {};

validatesInputData.isNumber = (Number) =>{
    const validatesNumber = joi.number().integer().required();
    return validatesNumber.validate(Number);
}

module.exports = validatesInputData
