const employeesController = {};

const logger = require('../logger/logger')
const employeesService = require('../services/employeesService');

const validator =require('../validator/validatesInputData');

employeesController.getAll = async function (req, res, next) {
    logger.info('Entering employeesController:GET')
    logger.debug('Try get all employees');
    const resultGetAll = await employeesService.getAll()
    if(!resultGetAll.success){
        logger.warn("Entering employeesController.Get: Failure.",resultGetAll); // depends
        res.status(404).send(resultGetAll);
    }
    logger.info('get request went well')
    res.send(resultGetAll.data);
};

employeesController.getById = function (req, res, next) {
    let id = Number(req.params.id)
    res.send(`${id} get working`);
};

employeesController.createNewEmployee = function (req, res, next) {

    const {error} = validator.employeesSchema(req.body);

    res.send(error);
    console.log(error);
};

employeesController.updateById = function (req, res, next) {

    let id = Number(req.params.id)
    res.send(`${id} update working`);
};

employeesController.deleteById = function(req, res, next) {
    let id = Number(req.params.id)
    res.send(`${id} delete working`);
  };




module.exports = employeesController;