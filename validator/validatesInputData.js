const joi = require('joi');

const validatesInputData = {};

validatesInputData.isNumber = (number) =>{
    const validatesNumber = joi.number().integer().required();
    return validatesNumber.validate(Number(number));
}

module.exports = validatesInputData
