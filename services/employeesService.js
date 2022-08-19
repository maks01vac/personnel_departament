const employeesService = {};

const validator = require('../validator/validatesInputData');
const employeesRepository = require('../repositories/employeesRepository');
const positionRepository = require('../repositories/positionRepository');
const logger = require('../logger/logger');
const createServiceErrors = require('./errors/createServiceErrors')
const employeeSchemaValidator = require('../models/employee/schemaValidator');

employeesService.getAll = async function () {
    try {

        const resultGetAll = await employeesRepository.getAll();
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
        return resultGetById;
    }
    catch (err) {

        logger.error("An unexpected error has occurred.Details", err)
        return createServiceErrors.unexpectedError(err)

    }
}

employeesService.createNewDepartment = async function (employeeData) {
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

employeesService.assignOrUpdatePosition = async function (employeeId, positionData, updateOrAssignmentMethodRepository) {
    try {

        const validatesId = validator.isNumber(employeeId);
        const validatesPositionData = employeeSchemaValidator.positionAssignmentSchema(positionData);

        if (validatesId.error) {

            return createServiceErrors.invalidId(validatesId.error.details[0]);

        }

        if (validatesPositionData.error) {

            return createServiceErrors.invalidData(validatesPositionData.error.details[0]);

        }

        const positionSearch = await positionRepository.getById(positionData.position);
        const employeeSearch = await employeesRepository.getById(employeeId);

        if (positionSearch.success === false) {

            return positionSearch;

        }

        if (employeeSearch.success === false) {

            return employeeSearch

        }

        if (employeeSearch.data.position === null) {

            const resultAssignPosition = await employeesRepository.assignPosition(employeeId, positionData);
            return resultAssignPosition;

        }

        const currentPosition = employeeSearch.data.position.id;
        const AssignPositionResult = await employeesRepository.updatePosition(employeeId, positionData, currentPosition)

        return AssignPositionResult;

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
