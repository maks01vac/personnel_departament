const departmentController = {};

const logger = require('../logger/logger')
const departmentService = require('../services/departmentService');
const mappers = require('./errors/mappers');
const createResponse = require('./createResponse')


departmentController.getAll = async function (req, res, next) {

    logger.info('Entering departmentController:GET')
    logger.debug('Try get all departments');

    const resultGetAll = await departmentService.getAll();

    const {statusCode, response} = createResponse(resultGetAll);
    res.status(statusCode).send(response);


};

departmentController.getById = async function (req, res, next) {
    let id = req.params.id

    const resultGetDepartmentById = await departmentService.getById(id);

    const {statusCode, response} = createResponse(resultGetDepartmentById);
    res.status(statusCode).send(response);

};



departmentController.createNewDepartment = async function (req, res, next) {
    const reqBody = req.body;
    logger.info('Entering departmentController.POST');
    logger.debug(`Trying to create new department with params:`,reqBody);

    const resultCreateNewDepartment = await departmentService.createNewDepartment(reqBody); 

    const {statusCode, response} = createResponse(resultCreateNewDepartment);
    res.status(statusCode).send(response);


};


departmentController.assignEmployees = async function (req, res, next) {
    const reqBody = req.body;
    const id = req.params.id;
  
    logger.info('Entering departmentController.POST');
    logger.debug('trying to assign employee to the department with params', reqBody, id);
  
    const resultAssignEmployee = await departmentService.assignEmployees(id, reqBody);
  
    const {statusCode, response} = createResponse(resultAssignEmployee);
    res.status(statusCode).send(response);

  };

departmentController.updateById =async function (req, res, next) {
    const reqBody = req.body;
    const id =req.params.id
    logger.info('Entering departmentController.PUT');
    logger.debug(`Trying to update department with params:`,reqBody , id );
    
    const resultUpdateDepartmentById = await departmentService.updateById(id,reqBody);

    const {statusCode, response} = createResponse(resultUpdateDepartmentById);
    res.status(statusCode).send(response);

};

departmentController.deleteById =async function (req, res, next) {
    let id = req.params.id

    const resultDeleteDepartmentById = await departmentService.deleteById(id);

    const {statusCode, response} = createResponse(resultDeleteDepartmentById);
    res.status(statusCode).send(response);

};




module.exports = departmentController;
