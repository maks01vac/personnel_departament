const employeesService = {};

const validator = require('../validator/validatesInputData');
const employeesRepository = require('../repositories/employeesRepository');
const logger = require('../logger/logger');

employeesService.getAll = async function () {

    const resultGetAllEmployees = await employeesRepository.getAll();
    logger.info('The result data is received')
    return resultGetAllEmployees;
}

employeesService.getById = async function (id) {

    const validatesId = validator.isNumber(Number(id));

    if (validatesId.error) {
        logger.warn('Id is not valid');
        return {
            success: false,
            error: {
                details: validatesId.error.details,
                errorCode: "INVALID_ID"
            },
        }
    }
    logger.info('Valid id');
    const resultGetEmployeeById = await employeesRepository.getById(id);
    return resultGetEmployeeById;
}

employeesService.createNewEmployee = async function (employeeData) {

    const resultValidationEmployeeData = validator.employeesSchema(employeeData);
    if (resultValidationEmployeeData.error) {
        logger.warn('Employee data has not been validated');
        return {
            success: false,
            error:{
                details:resultValidationEmployeeData.error.details,
                errorCode:"INVALID_DATA"
            } ,
        }
    }
    logger.info('the employee data is valid')
    const resultCreateNewEmployee = await employeesRepository.createNewEmployee(employeeData);
    return resultCreateNewEmployee
}

employeesService.updateById = async function (id,employeeData) {
    const validatesId = validator.isNumber(Number(id));
    const resultValidationEmployeeData = validator.employeesSchema(employeeData);

    if (validatesId.error) {
        logger.warn('Id is not valid');
        return {
            success: false,
            error:{
                details:validatesId.error.details,
                errorCode:"INVALID_ID"
            } ,
        }
    } else if (resultValidationEmployeeData.error) {
        logger.warn('Employee data has not been validated');
        return {
            success: false,
            error:{
                details:resultValidationEmployeeData.error.details,
                errorCode:"INVALID_DATA"
            } ,
        }
    }

    logger.info('Valid id');
    logger.info('the employee data is valid')
    const resultUpdateEmployeeById = employeesRepository.updateById(id,employeeData)

    return resultUpdateEmployeeById;

}

employeesService.deleteById =async function(id){
    const validatesId = validator.isNumber(Number(id));

    if (validatesId.error) {
        logger.warn('Id is not valid');
        return {
            success: false,
            error:{
                details:validatesId.error.details,
                errorCode:"INVALIV_ID"
            } ,
        }
    }
    logger.info('Valid id');
    const UpdateEmployeeByIdResult = await employeesRepository.deleteById(id);
    return UpdateEmployeeByIdResult;
}



module.exports = employeesService;