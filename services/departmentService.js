const departmentService = {};

const validator = require('../validator/validatesInputData');
const departmentRepository = require('../repositories/department/departmentRepository');
const logger = require('../logger/logger');
const createServiceErrors = require('./errors/createServiceErrors')
const departmentSchemaValidator = require('../models/department/schemaValidator')

departmentService.getAll = async function () {
    try {
        const resultGetAllDepartment = await departmentRepository.getAll();

        logger.info('The result data is received')
    
        return resultGetAllDepartment;
    }
    catch (err) {
        return createServiceErrors.unexpectedError(err)
    }
}

departmentService.getById = async function (id) {

    try {
        const validatesId = validator.isNumber(Number(id));

        if (validatesId.error) {
            return createServiceErrors.invalidId(validatesId.error);
        }
    
        const resultGetDepartmentById = await departmentRepository.getById(id);

        resultGetDepartmentById.data=resultGetDepartmentById.data[0];

        return resultGetDepartmentById;
    }
    catch (err) {
        return createServiceErrors.unexpectedError(err)
    }
}

departmentService.createNewDepartment = async function (departmentData) {
    try {
        const resultValidationDepartmentData = departmentSchemaValidator.validateSchema(departmentData);

        if (resultValidationDepartmentData.error) {
            return createServiceErrors.invalidData(resultValidationDepartmentData.error);
        }
    
        const resultCreateNewDepartment = await departmentRepository.createNewDepartment(departmentData);
        return resultCreateNewDepartment;
    }
    catch (err) {
        return createServiceErrors.unexpectedError(err);
    }
}

departmentService.updateById = async function (departmentId, departmentData) {
    try {
        const validatesId = validator.isNumber(Number(departmentId));
        const resultValidationDepartmentData = departmentSchemaValidator.validateSchema(departmentData);

        if (validatesId.error) {

            return createServiceErrors.invalidId(validatesId.error);

        } else if (resultValidationDepartmentData.error) {

            return createServiceErrors.invalidData(resultValidationDepartmentData.error);

        }
        const resultUpdateDepartmentById = departmentRepository.updateById(departmentId, departmentData);
        
        return resultUpdateDepartmentById;
    }
    catch(err) {
        return createServiceErrors.unexpectedError(err)
    }


}

departmentService.deleteById = async function (departmentId) {
    try {
        const validatesId = validator.isNumber(Number(departmentId));

        if (validatesId.error) {
            return createServiceErrors.invalidId(validatesId.error);
        }
    
    
        const UpdateDepartmentByIdResult = await departmentRepository.deleteById(departmentId);
        return UpdateDepartmentByIdResult;
    }
    catch(err) {
        return createServiceErrors.unexpectedError(err)
    }
}



module.exports = departmentService;
