const joi = require('joi');
const departmentSchemaValidator = {}


departmentSchemaValidator.validateSchema = (data) => {
    const schema = joi.object({
        name:joi.string().min(3).max(30).required(),
    })
    return schema.validate(data);
}

departmentSchemaValidator.validateEmployeeId = (data)=>{
    const schema =oi.object({
        employeeId:joi.number().integer().required(),
    })
    return schema.validate(data)
}

module.exports =departmentSchemaValidator;

