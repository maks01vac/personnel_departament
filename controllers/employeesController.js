const employeesController = {};

//const employeesService = require('../services/employeesServise');


employeesController.getAll = function (req, res, next) {
    res.send('get all working');
};

employeesController.getById = function (req, res, next) {
    let id = Number(req.params.id)
    res.send(`${id} get working`);
};

employeesController.createNewEmployee = function (req, res, next) {
    res.send('post working');
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