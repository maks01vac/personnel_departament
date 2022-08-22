const positionService = {};

const validator = require('../validator/validatesInputData');
const positionRepository = require('../repositories/position/positionRepository');
const logger = require('../logger/logger');
const createServiceErrors = require('./errors/createServiceErrors')
const positionSchemaValidator = require('../models/position/schemaValidator')

positionService.getAll = async function () {
    try {
        const resultGetAllPosition = await positionRepository.getAll();

        logger.info('The result data is received')
    
        return resultGetAllPosition;
    }
    catch (err) {
        return createServiceErrors.unexpectedError(err)
    }
}

positionService.getById = async function (id) {

    try {
        const validatesId = validator.isNumber(Number(id));

        if (validatesId.error) {
            return createServiceErrors.invalidId(validatesId.error);
        }
    
        const resultGetPositionById = await positionRepository.getById(id);

        resultGetPositionById.data = resultGetPositionById.data[0];

        return resultGetPositionById;
    }
    catch (err) {
        return createServiceErrors.unexpectedError(err)
    }
}

positionService.createNewPosition = async function (positionData) {
    try {
        const resultValidationPositionData = positionSchemaValidator.validateSchema(positionData);

        if (resultValidationPositionData.error) {
            return createServiceErrors.invalidData(resultValidationPositionData.error);
        }
    
        const resultCreateNewPosition = await positionRepository.createNewPosition(positionData);
        return resultCreateNewPosition;
    }
    catch (err) {
        return createServiceErrors.unexpectedError(err);
    }
}

positionService.updateById = async function (positionId, positionData) {
    try {
        const validatesId = validator.isNumber(Number(positionId));
        const resultValidationPositionData = positionSchemaValidator.validateSchema(positionData);

        if (validatesId.error) {

            return createServiceErrors.invalidId(validatesId.error);

        } else if (resultValidationPositionData.error) {

            return createServiceErrors.invalidData(resultValidationPositionData.error);

        }
        const resultUpdatePositionById = positionRepository.updateById(positionId, positionData)
        return resultUpdatePositionById;
    }
    catch(err) {
        return createServiceErrors.unexpectedError(err)
    }


}

positionService.deleteById = async function (positionId) {
    try {
        const validatesId = validator.isNumber(Number(positionId));

        if (validatesId.error) {
            return createServiceErrors.invalidId(validatesId.error);
        }
    
    
        const UpdatePositionByIdResult = await positionRepository.deleteById(positionId);
        return UpdatePositionByIdResult;
    }
    catch(err) {
        return createServiceErrors.unexpectedError(err)
    }
}



module.exports = positionService;
