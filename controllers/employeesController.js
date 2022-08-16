const employeesController = {};

const logger = require('../logger/logger')
const employeesService = require('../services/employeesService');

const validator = require('../validator/validatesInputData');

employeesController.getAll = async function (req, res, next) {
    logger.info('Entering employeesController:GET')
    logger.debug('Try get all employees');
    const resultGetAll = await employeesService.getAll()
    if (!resultGetAll.success) {
        logger.warn("Entering employeesController.Get: Failure.", resultGetAll); // depends
        res.status(404).send(resultGetAll);
    }
    logger.info('get request went well')
    res.send(resultGetAll.data);
};

employeesController.getById = async function (req, res, next) {
    let id = req.params.id

    const validatesId = validator.isNumber(Number(id));

    const resultGetEmployeeById = await employeesService.getById(id);
    if (!resultGetEmployeeById.success) {
        logger.warn('Entering employeesControlle.GET:Failure')
        res.status(404).send(resultGetEmployeeById);
    }
    res.send(resultGetEmployeeById);
};

employeesController.createNewEmployee = async function (req, res, next) {
    const reqBody = req.body;
    logger.info('Entering CourseController.POST');
    logger.debug(`Trying to create a course with params:${reqBody} `);

    const resultCreateNewEmployee = await employeesService.createNewEmployee(reqBody);
    logger.debug('Trying to create a course with params.', resultCreateNewEmployee);
    if (resultCreateNewEmployee.success) {
        logger.info('Entering CourseController.POST: Success');
        res.status(200).send('Пользователь добавлен');
      }
      else {
        logger.warn("Entering CourseController.POST: Failure.", resultCreateNewEmployee); // depends
        res.status(404).send(resultCreateNewEmployee);
      }

};

employeesController.updateById = function (req, res, next) {

    let id = Number(req.params.id)
    res.send(`${id} update working`);
};

employeesController.deleteById = function (req, res, next) {
    let id = Number(req.params.id)
    res.send(`${id} delete working`);
};




module.exports = employeesController;