const employeesService = {};

const validator = require('../validator/validatesInputData');
const employeesRepository = require('../repositories/employeesRepository');
const positionRepository = require('../repositories/positionRepository');
const logger = require('../logger/logger');
const createServiceErrors = require('./errors/createServiceErrors')
const employeeSchemaValidator = require('../models/employee/schemaValidator');

employeesService.getAll = async function () {
    try {
        const resultGetAllEmployees = await employeesRepository.getAll();

        logger.info('The result data is received')

        return resultGetAllEmployees;
    }
    catch (err) {
        return createServiceErrors.unexpectedError(err)
    }

}

employeesService.getById = async function (id) {
    try {
        const validatesId = validator.isNumber(Number(id));

        if (validatesId.error) {
            return createServiceErrors.invalidId(validatesId.error);
        }

        const resultGetEmployeeById = await employeesRepository.getById(id);
        return resultGetEmployeeById;
    }
    catch (err) {
        return createServiceErrors.unexpectedError(err)
    }
}

employeesService.createNewDepartment = async function (employeeData) {
    try {
        const resultValidationEmployeeData = employeeSchemaValidator.validateSchema(employeeData);

        if (resultValidationEmployeeData.error) {
            return createServiceErrors.invalidData(resultValidationEmployeeData.error);
        }
    
        const resultCreateNewEmployee = await employeesRepository.createNewEmployee(employeeData);
        return resultCreateNewEmployee;
    }
    catch (err) {
        return createServiceErrors.unexpectedError(err)
    }
}

employeesService.assignPositionToEmployee = async function(employeeId,positionData){
    try {
        const validatesId = validator.isNumber(Number(employeeId));
        const validatesPositionData = employeeSchemaValidator.positionAssignmentSchema(positionData);
        const positionSearch = positionRepository.getById(positionData.position);
    
        if (validatesId.error) {
            return createServiceErrors.invalidId(validatesId.error);

        }else if (validatesPositionData.error){

            return createServiceErrors.invalidData(validatesPositionData.error);

        } else if(positionSearch.success===false){

            return positionSearch

        }

        const resultAssignPositionToEmployee =employeesRepository.assignPositionToEmployee(employeeId,positionData)
        return resultAssignPositionToEmployee
    }
    catch (err) {
        return createServiceErrors.unexpectedError(err)
    }
}

employeesService.updateById = async function (id, employeeData) {

    try {
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
    catch (err) {
        return createServiceErrors.unexpectedError(err)
    }
}

employeesService.deleteById = async function (id) {
    try {
        const validatesId = validator.isNumber(Number(id));

        if (validatesId.error) {
            return createServiceErrors.invalidId(validatesId.error);
        }
    
    
        const UpdateEmployeeByIdResult = await employeesRepository.deleteById(id);
        return UpdateEmployeeByIdResult;
    
    }
    catch (err) {
        return createServiceErrors.unexpectedError(err)
    }

}



module.exports = employeesService;
