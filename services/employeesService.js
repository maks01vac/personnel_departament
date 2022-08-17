const employeesService = {};

const validator = require('../validator/validatesInputData');
const employeesRepository = require('../repositories/employeesRepository');
const logger = require('../logger/logger');
const createServiceErrors = require('./errors/createServiceErrors')
const employeeSchemaValidator = require('../models/employee/schemaValidator')

employeesService.getAll = async function () {
    const resultGetAllEmployees = await employeesRepository.getAll();

    logger.info('The result data is received')

    return resultGetAllEmployees;
}

employeesService.getById = async function (id) {

    const validatesId = validator.isNumber(Number(id));

    if (validatesId.error) {
        return createServiceErrors.invalidId(validatesId.error);
    }

    const resultGetEmployeeById = await employeesRepository.getById(id);
    return resultGetEmployeeById;
}

employeesService.createNewEmployee = async function (employeeData) {

    const resultValidationEmployeeData = employeeSchemaValidator.validateSchema(employeeData);

    if (resultValidationEmployeeData.error) {
        return createServiceErrors.invalidData(resultValidationEmployeeData.error);
    }

    const resultCreateNewEmployee = await employeesRepository.createNewEmployee(employeeData);
    return resultCreateNewEmployee;
}

employeesService.updateById = async function (id, employeeData) {

    const validatesId = validator.isNumber(Number(id));

    const resultValidationEmployeeData = employeeSchemaValidator.validateSchema(employeeData);

    if (validatesId.error) {

        return createServiceErrors.invalidId(validatesId.error);

    } else if (resultValidationEmployeeData.error) {
        return createServiceErrors.invalidData(resultValidationEmployeeData.error);
    }

    const resultUpdateEmployeeById = employeesRepository.updateById(id, employeeData)

    return resultUpdateEmployeeById;

}

employeesService.deleteById = async function (id) {
    const validatesId = validator.isNumber(Number(id));

    if (validatesId.error) {
        return createServiceErrors.invalidId(validatesId.error);
    }


    const UpdateEmployeeByIdResult = await employeesRepository.deleteById(id);
    return UpdateEmployeeByIdResult;
}



module.exports = employeesService;
