const positionController = {};

const logger = require('../logger/logger')
const positionService = require('../services/positionService');
const mappers = require('./errors/mappers')


positionController.getAll = async function (req, res, next) {

    logger.info('Entering positionController:GET')
    logger.debug('Try get all positions');

    const resultGetAll = await positionService.getAll();

    if (!resultGetAll.success) {
        logger.warn("Entering positionController.Get: Failure.", resultGetAll);

        const statusCode = mappers.mapErrorCodeToHttpCode(resultGetAll.error.errorCode);

        res.status(statusCode).send(resultGetAll);

    } else {
        res.send(resultGetAll.data);
        logger.info('get request went well')
    }


};

positionController.getById = async function (req, res, next) {
    let id = req.params.id

    const resultGetPositionById = await positionService.getById(id);
    console.log(resultGetPositionById);
    if (!resultGetPositionById.success) {
        logger.warn('Entering positionController.GET:Failure');

        const statusCode = mappers.mapErrorCodeToHttpCode(resultGetPositionById.error.errorCode);

        res.status(statusCode).send(resultGetPositionById);
    } else res.send(resultGetPositionById);

};

positionController.createNewPosition = async function (req, res, next) {
    const reqBody = req.body;
    logger.info('Entering positionController.POST');
    logger.debug(`Trying to create new position with params:${reqBody} `);

    const resultCreateNewPosition = await positionService.createNewPosition(reqBody);
    logger.debug('Trying to create new position with params.', resultCreateNewPosition);
    if (resultCreateNewPosition.success) {
        logger.info('Entering positionController.POST: Success');
        res.status(200).send(resultCreateNewPosition);
      }
      else {
        logger.warn("Entering positionController.POST: Failure.", resultCreateNewPosition);

        const statusCode = mappers.mapErrorCodeToHttpCode(resultCreateNewPosition.error.errorCode);

        res.status(statusCode).send(resultCreateNewPosition);
      }

};

positionController.updateById =async function (req, res, next) {
    const reqBody = req.body;
    const id =req.params.id
    logger.info('Entering positionController.PUT');
    logger.debug(`Trying to update position with params:${reqBody} , ${id} `);

    const resultUpdatePositionById = await positionService.updateById(id,reqBody);
    logger.debug('Trying to update position with params.', resultUpdatePositionById);
    if (resultUpdatePositionById.success) {
        logger.info('Entering positionController.PUT: Success');
        res.status(200).send(resultUpdatePositionById);
      }
      else {
        logger.warn("Entering positionController.PUT: Failure.", resultUpdatePositionById);

        const statusCode = mappers.mapErrorCodeToHttpCode(resultUpdatePositionById.error.errorCode);

        res.status(statusCode).send(resultUpdatePositionById);
      }
};

positionController.deleteById =async function (req, res, next) {
    let id = req.params.id

    const resultDeletePositionById = await positionService.deleteById(id);
    if (!resultDeletePositionById.success) {
        logger.warn('Entering positionController.DELETE:Failure');

        const statusCode = mappers.mapErrorCodeToHttpCode(resultDeletePositionById.error.errorCode);

        res.status(statusCode).send(resultDeletePositionById);
    } else {
        logger.info('Entering positionController.DELETE: Success');
        res.send(resultDeletePositionById);
    }

};




module.exports = positionController;
