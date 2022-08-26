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

    // if (!resultGetAll.success) {
    //     logger.warn("Entering departmentController.Get: Failure.", resultGetAll);

    //     const statusCode = mappers.mapErrorCodeToHttpCode(resultGetAll.error.errorCode);

    //     

    // } else {
    //     res.send(resultGetAll.data);
    //     logger.info('get request went well')
    // }


};

departmentController.getById = async function (req, res, next) {
    let id = req.params.id

    const resultGetDepartmentById = await departmentService.getById(id);
    console.log(resultGetDepartmentById);

    const {statusCode, response} = createResponse(resultGetDepartmentById);
    res.status(statusCode).send(response);


    // if (!resultGetDepartmentById.success) {
    //     logger.warn('Entering departmentController.GET:Failure');

    //     const statusCode = mappers.mapErrorCodeToHttpCode(resultGetDepartmentById.error.errorCode);

    //     res.status(statusCode).send(resultGetDepartmentById);
    // } else res.send(resultGetDepartmentById);

};

departmentController.createNewDepartment = async function (req, res, next) {
    const reqBody = req.body;
    logger.info('Entering departmentController.POST');
    logger.debug(`Trying to create new department with params:`,reqBody);

    const resultCreateNewDepartment = await departmentService.createNewDepartment(reqBody); 

    const {statusCode, response} = createResponse(resultCreateNewDepartment);
    res.status(statusCode).send(response);

    // logger.debug('Trying to create new department with params.', resultCreateNewDepartment);
    // if (resultCreateNewDepartment.success) {
    //     logger.info('Entering departmentController.POST: Success');
    //     res.status(200).send(resultCreateNewDepartment);
    //   }
    //   else {
    //     logger.warn("Entering departmentController.POST: Failure.", resultCreateNewDepartment);

    //     const statusCode = mappers.mapErrorCodeToHttpCode(resultCreateNewDepartment.error.errorCode);

    //     res.status(statusCode).send(resultCreateNewDepartment);
    //   }

};


departmentController.assignEmployees = async function (req, res, next) {
    const reqBody = req.body;
    const id = req.params.id;
  
    logger.info('Entering departmentController.POST');
    logger.debug('trying to assign employee to the department with params', reqBody, id);
  
    const resultAssignEmployee = await departmentService.assignEmployees(id, reqBody);
  
    const {statusCode, response} = createResponse(resultAssignEmployee);
    res.status(statusCode).send(response);

  
    // if (resultAssignEmployee.success) {
  
    //   logger.info('Entering departmentController.POST: Success',resultAssignEmployee);
    //   res.status(200).send(resultAssignEmployee);
  
    //   return;
    // }
  
    // logger.warn("Entering departmentController.POST: Failure.", resultAssignEmployee);
    // const statusCode = mappers.mapErrorCodeToHttpCode(resultAssignEmployee.error.errorCode);
  
    // res.status(statusCode).send(resultAssignEmployee);
  };

departmentController.updateById =async function (req, res, next) {
    const reqBody = req.body;
    const id =req.params.id
    logger.info('Entering departmentController.PUT');
    logger.debug(`Trying to update department with params:`,reqBody , id );
    
    const resultUpdateDepartmentById = await departmentService.updateById(id,reqBody);

    const {statusCode, response} = createResponse(resultUpdateDepartmentById);
    res.status(statusCode).send(response);


    // logger.debug('Trying to update department with params.', resultUpdateDepartmentById);
    // if (resultUpdateDepartmentById.success) {
    //     logger.info('Entering departmentController.PUT: Success');
    //     res.status(200).send(resultUpdateDepartmentById);
    //   }
    //   else {
    //     logger.warn("Entering departmentController.PUT: Failure.", resultUpdateDepartmentById);

    //     const statusCode = mappers.mapErrorCodeToHttpCode(resultUpdateDepartmentById.error.errorCode);

    //     res.status(statusCode).send(resultUpdateDepartmentById);
    //   }
};

departmentController.deleteById =async function (req, res, next) {
    let id = req.params.id

    const resultDeleteDepartmentById = await departmentService.deleteById(id);

    const {statusCode, response} = createResponse(resultDeleteDepartmentById);
    res.status(statusCode).send(response);

    // if (!resultDeleteDepartmentById.success) {
    //     logger.warn('Entering departmentController.DELETE:Failure');

    //     const statusCode = mappers.mapErrorCodeToHttpCode(resultDeleteDepartmentById.error.errorCode);

    //     res.status(statusCode).send(resultDeleteDepartmentById);
    // } else {
    //     logger.info('Entering departmentController.DELETE: Success');
    //     res.send(resultDeleteDepartmentById);
    // }

};




module.exports = departmentController;
