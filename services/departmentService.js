const departmentService = {};

const validator = require('../validator/validatesInputData');
const departmentRepository = require('../repositories/department/departmentRepository');
const logger = require('../logger/logger');
const createServiceErrors = require('./errors/createServiceErrors')
const departmentSchemaValidator = require('../models/department/schemaValidator');
const { func } = require('joi');

departmentService.getAll = async function (ids) {
    try {
        const resultGetAllDepartment = await departmentRepository.getAll(ids);

        logger.info('The result data is received')

        return resultGetAllDepartment;
    }
    catch (err) {
        return createServiceErrors.unexpectedError(err)
    }
}

departmentService.getById = async function (departmentId) {

    try {
        const validatesId = validator.isNumber(Number(departmentId));

        if (validatesId.error) {
            return createServiceErrors.invalidId(validatesId.error);
        }

        const resultGetDepartmentById = await departmentRepository.getById(departmentId);

        resultGetDepartmentById.data = resultGetDepartmentById.data[0];

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


departmentService.assignEmployees = async function (departmentId, employeesId) {

    try {
        const validatesId = validator.isNumber(Number(departmentId));

        if (validatesId.error) {
            return createServiceErrors.invalidId(validatesId.error);
        } 

        if (Array.isArray(employeesId)) {

            employeesId.forEach(employeeId => {

                const resultValidatesEmployeeId = departmentSchemaValidator.validateEmployeeId(employeeId);

                if (resultValidatesEmployeeId.error) {

                    return createServiceErrors.invalidData(resultValidatesEmployeeId.error);

                }
            });

        }


        const resultValidatesEmployeeId = departmentSchemaValidator.validateEmployeeId(employeesId);

        if (resultValidatesEmployeeId.error) {

            return createServiceErrors.invalidData(resultValidatesEmployeeId.error);

        }



        const resultGetDepartmentById = await this.getAll(id);

        resultGetDepartmentById.data = resultGetDepartmentById.data[0];

        return resultGetDepartmentById;
    }
    catch (err) {
        return createServiceErrors.unexpectedError(err)
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
    catch (err) {
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
    catch (err) {
        return createServiceErrors.unexpectedError(err)
    }
}



module.exports = departmentService;
