var express = require('express');
var router = express.Router();
var express = require('express');

const employeesController = require('../controllers/employeesController')

var employeesRouter = express.Router();

employeesRouter.get('/employees',employeesController.getAll);

employeesRouter.get('/employees/:id',employeesController.getById);

employeesRouter.post('/employees',employeesController.createNewEmployee);

employeesRouter.post('/employees/:id/assign_position',employeesController.assignPositionToEmployee);

employeesRouter.put('/employees/:id/update_position',employeesController.updatePositionToEmployee);

employeesRouter.put('/employees/:id',employeesController.updateById);
  
employeesRouter.delete('/employees/:id',employeesController.deleteById);

module.exports = employeesRouter;