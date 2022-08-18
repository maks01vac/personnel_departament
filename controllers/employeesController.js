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

    } else {
        res.send(resultGetAll);
        logger.info('get request went well')
    }


};

employeesController.getById = async function (req, res, next) {
    let id = req.params.id

    const resultGetEmployeeById = await employeesService.getById(id);
    console.log(resultGetEmployeeById);
    if (!resultGetEmployeeById.success) {
        logger.warn('Entering employeesController.GET:Failure');

        const statusCode = mappers.mapErrorCodeToHttpCode(resultGetEmployeeById.error.errorCode);

        res.status(statusCode).send(resultGetEmployeeById);
    } else res.send(resultGetEmployeeById);

};

employeesController.createNewEmployee = async function (req, res, next) {
    const reqBody = req.body;
    logger.info('Entering employeesController.POST');
    logger.debug(`Trying to create new employee with params:${reqBody} `);

    const resultCreateNewEmployee = await employeesService.createNewDepartment(reqBody);
    logger.debug('Trying to create new employee with params.', resultCreateNewEmployee);
    if (resultCreateNewEmployee.success) {
        logger.info('Entering employeesController.POST: Success');
        res.status(200).send(resultCreateNewEmployee);
      }
      else {
        logger.warn("Entering employeesController.POST: Failure.", resultCreateNewEmployee);

        const statusCode = mappers.mapErrorCodeToHttpCode(resultCreateNewEmployee.error.errorCode);

        res.status(statusCode).send(resultCreateNewEmployee);
      }

};

employeesController.assignPositionToEmployee =async function (req, res, next) {
    const reqBody = req.body;
    const id =req.params.id
    logger.info('Entering employeesController.POST');
    logger.debug(`trying to assign a position to an employee with params:${reqBody} , ${id} `);

    const resultAssignPositionToEmployee = await employeesService.assignPositionToEmployee(id,reqBody);
    logger.debug('trying to assign a position to an employee with params.', resultAssignPositionToEmployee);
    if (resultAssignPositionToEmployee.success) {
        logger.info('Entering employeesController.POST: Success');
        res.status(200).send(resultAssignPositionToEmployee);
      }
      else {
        logger.warn("Entering employeesController.POST: Failure.", resultAssignPositionToEmployee);
        const statusCode = mappers.mapErrorCodeToHttpCode(resultAssignPositionToEmployee.error.errorCode);
        res.status(statusCode).send(resultAssignPositionToEmployee);
      }
};

employeesController.updateById =async function (req, res, next) {
    const reqBody = req.body;
    const id =req.params.id
    logger.info('Entering employeesController.PUT');
    logger.debug(`Trying to update employee with params:${reqBody} , ${id} `);

    const resultUpdateEmployeeById = await employeesService.updateById(id,reqBody);
    logger.debug('Trying to update employee with params.', resultUpdateEmployeeById);
    if (resultUpdateEmployeeById.success) {
        logger.info('Entering employeesController.PUT: Success');
        res.status(200).send(resultUpdateEmployeeById);
      }
      else {
        logger.warn("Entering employeesController.PUT: Failure.", resultUpdateEmployeeById);

        const statusCode = mappers.mapErrorCodeToHttpCode(resultUpdateEmployeeById.error.errorCode);

        res.status(statusCode).send(resultUpdateEmployeeById);
      }
};

employeesController.deleteById =async function (req, res, next) {
    let id = req.params.id

    const resultDeleteEmployeeById = await employeesService.deleteById(id);
    if (!resultDeleteEmployeeById.success) {
        logger.warn('Entering employeesController.DELETE:Failure');

        const statusCode = mappers.mapErrorCodeToHttpCode(resultDeleteEmployeeById.error.errorCode);

        res.status(statusCode).send(resultDeleteEmployeeById);
    } else {
        logger.info('Entering employeesController.DELETE: Success');
        res.send(resultDeleteEmployeeById);
    }

};




module.exports = employeesController;
