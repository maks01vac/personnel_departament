const employeesController = {};

const logger = require('../logger/logger')
const employeesService = require('../services/employeesService');
const mappers = require('./errors/mappers')


employeesController.getAll = async function (req, res, next) {

  logger.info('Entering employeesController:GET')
  logger.debug('Try get all employees');

  const resultGetAll = await employeesService.getAll()

  if (!resultGetAll.success) {

    logger.warn("Entering employeesController.Get: Failure.", resultGetAll);
    const statusCode = mappers.mapErrorCodeToHttpCode(resultGetAll.error.errorCode);

    res.status(statusCode).send(resultGetAll);

    return;

  }

  logger.warn('Entering employeesController.GET:Success',resultGetAll);
  res.send(resultGetAll);
};

employeesController.getById = async function (req, res, next) {

  const id = req.params.id

  const resultGetById = await employeesService.getById(id);
  console.log(resultGetById);

  if (!resultGetById.success) {

    logger.warn('Entering employeesController.GET:Failure',);
    const statusCode = mappers.mapErrorCodeToHttpCode(resultGetById.error.errorCode);

    res.status(statusCode).send(resultGetById);

    return;
  }

  logger.warn('Entering employeesController.GET:Success',resultGetById);
  res.send(resultGetById);

};

employeesController.createNewEmployee = async function (req, res, next) {
  const reqBody = req.body;

  logger.info('Entering employeesController.POST');
  logger.debug('Trying to create new employee with params:', reqBody);

  const resultCreateNewEmployee = await employeesService.createNewEmployee(reqBody);
  logger.debug('Trying to create new employee with params.', resultCreateNewEmployee);

  if (resultCreateNewEmployee.success) {

    logger.info('Entering employeesController.POST: Success',resultCreateNewEmployee);
    res.status(200).send(resultCreateNewEmployee);

    return;
  }

  logger.warn("Entering employeesController.POST: Failure.", resultCreateNewEmployee);
  const statusCode = mappers.mapErrorCodeToHttpCode(resultCreateNewEmployee.error.errorCode);

  res.status(statusCode).send(resultCreateNewEmployee);
};

employeesController.assignPositionToEmployee = async function (req, res, next) {
  const reqBody = req.body;
  const id = req.params.id;

  logger.info('Entering employeesController.POST');
  logger.debug('trying to assign a position to an employee with params', reqBody, id);

  const resultAssignPosition = await employeesService.assignOrUpdatePosition(id, reqBody);


  if (resultAssignPosition.success) {

    logger.info('Entering employeesController.POST: Success',resultAssignPosition);
    res.status(200).send(resultAssignPosition);

    return;
  }

  logger.warn("Entering employeesController.POST: Failure.", resultAssignPosition);
  const statusCode = mappers.mapErrorCodeToHttpCode(resultAssignPosition.error.errorCode);

  res.status(statusCode).send(resultAssignPosition);
};




employeesController.updateById = async function (req, res, next) {
  const reqBody = req.body;
  const id = req.params.id;

  logger.info('Entering employeesController.PUT');
  logger.debug('Trying to update employee with params:', reqBody, id);

  const resultUpdateById = await employeesService.updateById(id, reqBody);
  logger.debug('Trying to update employee with params.', resultUpdateById);

  if (resultUpdateById.success) {

    logger.info('Entering employeesController.PUT: Success',resultUpdateById);
    res.status(200).send(resultUpdateById);

    return;
  }

  logger.warn("Entering employeesController.PUT: Failure.", resultUpdateById);
  const statusCode = mappers.mapErrorCodeToHttpCode(resultUpdateById.error.errorCode);

  res.status(statusCode).send(resultUpdateById);
};

employeesController.deleteById = async function (req, res, next) {
  let id = req.params.id

  const resultDeleteById = await employeesService.deleteById(id);

  if (!resultDeleteById.success) {

    logger.warn('Entering employeesController.DELETE:Failure',resultDeleteById);
    const statusCode = mappers.mapErrorCodeToHttpCode(resultDeleteById.error.errorCode);

    res.status(statusCode).send(resultDeleteById);

    return;
  }

  logger.info('Entering employeesController.DELETE: Success');
  res.send(resultDeleteById);

};




module.exports = employeesController;
