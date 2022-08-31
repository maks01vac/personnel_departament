const employeesService = {};

const validator = require('../validator/validatesInputData');
const employeeSchemaValidator = require('../models/employee/schemaValidator');
const mappersEmployee = require('../models/employee/mapperEmployee');

const employeesRepository = require('../repositories/employee/employeesRepository');


const logger = require('../logger/logger');

const createServiceErrors = require('./errors/createServiceErrors');
const positionService = require('./positionService');


async function positionValidate(positionId) {
    const validatesPositionId = employeeSchemaValidator.positionAssignmentSchema(positionId)

    if (validatesPositionId.error) {
        return createServiceErrors.invalidId(validatesId.error.details[0]);
    }

    const positionSearch = await positionService.getById(positionId.position);

    if (positionSearch.success === false) {
        return positionSearch
    }
    return {
        success: true,
    }
}

async function departmentValidates(departmentId) {
    const validatesDepartmentId = employeeSchemaValidator.departmentAssignmentSchema(departmentId)

    if (validatesDepartmentId.error) {
        return createServiceErrors.invalidId(validatesId.error.details[0]);
    }

    const departmentSearch = await positionService.getById(positionId.position);

    if (departmentSearch.success === false) {
        return departmentSearch
    }
    return {
        success: true,
    }

}

async function employeeValidatesAndSearch(employeeId) {
    const validatesEmployeeId = validator.isNumber(employeeId)

    if (validatesEmployeeId.error) {
        return createServiceErrors.invalidId(validatesId.error.details[0]);
    }

    const employeeSearch = await employeesService.getById(positionId.position);

    if (employeeSearch.success === false) {
        return employeeSearch
    }
    return {
        success: true,
        data: employeeSearch.data
    }

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


        return await resultGetById;
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

        const resultValidatesPositionId = await positionValidate(positionId)

        if (resultValidatesPositionId.success === false) {
            return resultValidatesPositionId;
        }
        const resultValidatesEmployeeId = await employeeValidatesAndSearch(employeeId);

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
        const resultValidatesPositionId = await positionValidate(positionId)

        if (resultValidatesPositionId.success === false) {
            return resultValidatesPositionId;
        }
        const resultValidatesEmployeeId = await employeeValidatesAndSearch(employeeId);

        if (resultValidatesEmployeeId.success === false) {
            return resultValidatesEmployeeId
        }


        if (resultValidatesEmployeeId.data.department === null) {

            const resultAssignDepartment
            return resultAssignDepartment;

        }

        const currentDepartmentId = employeeSearch.data.department.id;

        if(currentDepartmentId !== departmentId.department){
            const updateDepartmentResult
        }
        

        return {
            success:true
        };

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
