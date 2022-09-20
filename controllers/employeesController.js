const employeesController = {};

const logger = require('../logger/logger')
const employeesService = require('../services/employeesService');
const mappers = require('./errors/mappers')
const createResponse = require('./createResponse')


employeesController.getAll = async function (req, res, next) {

  logger.info('Entering employeesController:GET')
  logger.debug('Try get all employees');

  const resultGetAll = await employeesService.getAll()

  const {statusCode, response} = createResponse(resultGetAll)
  res.status(statusCode).send(response);
}


employeesController.getById = async function (req, res, next) {

  const id = req.params.id
  logger.info('Entering employeesController.GET');
  logger.debug('Trying to create new employee with params:', id);

  const resultGetById = await employeesService.getById(id);

  const {statusCode, response} = createResponse(resultGetById)
  res.status(statusCode).send(response);

};

employeesController.createNewEmployee = async function (req, res, next) {
  const reqBody = req.body;

  logger.info('Entering employeesController.POST');
  logger.debug('Trying to create new employee with params:', reqBody);

  const resultCreateNewEmployee = await employeesService.createNewEmployee(reqBody);
  logger.debug('Trying to create new employee with params.', resultCreateNewEmployee);

  const {statusCode, response} = createResponse(resultCreateNewEmployee)
  res.status(statusCode).send(response);

};

employeesController.assignPositionToEmployee = async function (req, res, next) {
  const reqBody = req.body;
  const id = req.params.id;

  logger.info('Entering employeesController.POST');
  logger.debug('trying to assign a position to an employee with params', reqBody, id);

  const resultAssignPosition = await employeesService.assignOrUpdatePosition(id, reqBody);

  const {statusCode, response} = createResponse(resultAssignPosition)
  res.status(statusCode).send(response);

};


employeesController.assignDepartmentToEmployee = async function (req, res, next) {
  const reqBody = req.body;
  const id = req.params.id;

  logger.info('Entering employeesController.POST');
  logger.debug('trying to assign or update a department to an employee with params', reqBody, id);

  const resultAssignDepartment = await employeesService.assignOrUpdateDepartment(id, reqBody);

  const {statusCode, response} = createResponse(resultAssignDepartment)
  res.status(statusCode).send(response);

};



employeesController.updateById = async function (req, res, next) {
  const reqBody = req.body;
  const id = req.params.id;

  logger.info('Entering employeesController.PUT');
  logger.debug('Trying to update employee with params:', reqBody, id);

  const resultUpdateById = await employeesService.updateById(id, reqBody);
  logger.debug('Trying to update employee with params.', resultUpdateById);

  const {statusCode, response} = createResponse(resultUpdateById)
  res.status(statusCode).send(response);
};

employeesController.deleteById = async function (req, res, next) {
  const id = req.params.id

  const resultDeleteById = await employeesService.deleteById(id);

  const {statusCode, response} = createResponse(resultDeleteById)
  res.status(statusCode).send(response);

};




module.exports = employeesController;
