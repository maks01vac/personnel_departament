const employeesService = {};

const validator = require('../validator/validatesInputData');
const employeeSchemaValidator = require('../models/employee/schemaValidator');
const mappersEmployee = require('../models/employee/mapperEmployee');

const employeesRepository = require('../repositories/employee/employeesRepository');


const logger = require('../logger/logger');

const createServiceErrors = require('./errors/createServiceErrors');
const positionService = require('./positionService');

const getDepartmentByIdQuery = require('../queries/getDepartmentById');
const dbConnection = require('../database/dbConnection');
const moveEmployeeToDepartment = require('../commands/moveEmployeeToDepartment');
const assignEmployeeToDepartment = require('../commands/assignEmployeeToDepartment');
const createDatabaseError = require('../repositories/errors/databaseErrors');



async function validatePosition(positionId) {
    const validatesPositionId = employeeSchemaValidator.positionAssignmentSchema(positionId)

    if (validatesPositionId.error) {
        return createServiceErrors.invalidId(validatesPositionId.error.details[0]);
    }

    const positionSearch = await positionService.getById(positionId.position);

    if (positionSearch.success === false) {
        return positionSearch
    }
    return {
        success: true,
    }
}

async function validateDepartment(departmentId) {
    const validatesDepartmentId = employeeSchemaValidator.departmentAssignmentSchema(departmentId)

    if (validatesDepartmentId.error) {
        return createServiceErrors.invalidId(validatesDepartmentId.error.details[0]);
    }


    const departmentSearch = await dbConnection.execute(async context => {

        return getDepartmentByIdQuery(departmentId.department, context);

    })

    if (departmentSearch.success === false) {
        return departmentSearch
    }

    if(!departmentSearch.data.length){
        return createDatabaseError.idNotFound(departmentId.department)
    }

    return {
        success: true,
    }

}

async function queryAndValidateEmployee(employeeId) {
    const validatesEmployeeId = validator.isNumber(employeeId)

    if (validatesEmployeeId.error) {
        return createServiceErrors.invalidId(validatesEmployeeId.error.details[0]);
    }

    const employeeSearch = await employeesService.getById(employeeId);

    return employeeSearch

}


employeesService.getAll = async function (ids) {
    try {

        const resultGetAll = await employeesRepository.getAll(ids);

        const mappingData = mappersEmployee.restructureEmployeeData(resultGetAll.data);

        resultGetAll.data = mappingData;
        logger.info('The result data is received')

        return resultGetAll;
    }
    catch (err) {

        logger.error("An unexpected error has occurred.Details", err)
        return createServiceErrors.unexpectedError(err);

    }

}

employeesService.getById = async function (employeeId) {
    try {

        const validatesId = validator.isNumber(employeeId);

        if (validatesId.error) {
            return createServiceErrors.invalidId(validatesId.error);
        }

        const resultGetById = await employeesRepository.getById(employeeId);
        if (resultGetById.success) {

            const mappingData = mappersEmployee.restructureEmployeeData(resultGetById.data);
            resultGetById.data = mappingData[0];

        }
        return  resultGetById;
    }
    
    catch (err) {

        logger.error("An unexpected error has occurred.Details", err)
        return createServiceErrors.unexpectedError(err)

    }
}

employeesService.createNewEmployee = async function (employeeData) {
    try {
        const resultValidationData = employeeSchemaValidator.validateSchema(employeeData);

        if (resultValidationData.error) {
            return createServiceErrors.invalidData(resultValidationData.error);
        }

        const resultCreateNewEmployee = await employeesRepository.createNewEmployee(employeeData);
        return resultCreateNewEmployee;
    }
    catch (err) {

        logger.error("An unexpected error has occurred.Details", err);
        return createServiceErrors.unexpectedError(err);

    }
}

employeesService.assignOrUpdatePosition = async function (employeeId, positionId) {
    try {

        const resultValidatesPositionId = await validatePosition(positionId)

        if (resultValidatesPositionId.success === false) {
            return resultValidatesPositionId;
        }
        const resultValidatesEmployeeId = await queryAndValidateEmployee(employeeId);

        if (resultValidatesEmployeeId.success === false) {
            return resultValidatesEmployeeId
        }

        if (resultValidatesEmployeeId.data.position === null) {

            const resultAssignPosition = await employeesRepository.assignPosition(employeeId, positionId);
            return resultAssignPosition;

        }

        const currentPosition = resultValidatesEmployeeId.data.position.id;
        const updatePositionResult = await employeesRepository.updatePosition(employeeId, positionId, currentPosition)

        return updatePositionResult;

    }
    catch (err) {

        logger.error("An unexpected error has occurred.Details", err);
        return createServiceErrors.unexpectedError(err);

    }
}

employeesService.assignOrUpdateDepartment = async function (employeeId, departmentId) {
    try {
        const resultValidatesDepartmentId = await validateDepartment(departmentId)

        if (resultValidatesDepartmentId.success === false) {
            return resultValidatesDepartmentId;
        }
        const resultValidatesEmployeeId = await queryAndValidateEmployee(employeeId);

        if (resultValidatesEmployeeId.success === false) {
            return resultValidatesEmployeeId
        }

        employeeId = [employeeId];

        const assignOrUpdateDepartmentResult = dbConnection.execute(async context => {
            if (resultValidatesEmployeeId.data.department == null) {
                await assignEmployeeToDepartment(departmentId.department, employeeId, context);
            }

            if (resultValidatesEmployeeId.data.department?.id !== departmentId.department) {
                await moveEmployeeToDepartment(departmentId.department, employeeId, context)
            }
            return [];
        })

        return assignOrUpdateDepartmentResult
    }
    catch (err) {

        logger.error("An unexpected error has occurred.Details", err);
        return createServiceErrors.unexpectedError(err);

    }
}



employeesService.updateById = async function (employeeId, employeeData) {

    try {
        const validatesId = validator.isNumber(employeeId);

        const resultValidationData = employeeSchemaValidator.validateSchema(employeeData);

        if (validatesId.error) {

            return createServiceErrors.invalidId(validatesId.error);

        } else if (resultValidationData.error) {
            return createServiceErrors.invalidData(resultValidationData.error);
        }

        const UpdateByIdResult = employeesRepository.updateById(employeeId, employeeData)

        return UpdateByIdResult;

    }
    catch (err) {

        logger.error("An unexpected error has occurred.Details", err);
        return createServiceErrors.unexpectedError(err);

    }
}

employeesService.deleteById = async function (employeeId) {
    try {

        const validatesId = validator.isNumber(employeeId);

        if (validatesId.error) {
            return createServiceErrors.invalidId(validatesId.error);
        }


        const UpdateByIdResult = await employeesRepository.deleteById(employeeId);
        return UpdateByIdResult;

    }
    catch (err) {

        logger.error("An unexpected error has occurred.Details", err)
        return createServiceErrors.unexpectedError(err);

    }

}



module.exports = employeesService;
