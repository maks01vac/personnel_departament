var express = require('express');
var router = express.Router();
var express = require('express');

const departmentController = require('../controllers/departmentController');
const { idNotFound } = require('../repositories/errors/databaseErrors');

var departmentRouter = express.Router();

departmentRouter.get('/department',departmentController.getAll);

departmentRouter.get('/department/:id',departmentController.getById);


departmentRouter.post('/department',departmentController.createNewDepartment);

departmentRouter.post('/department/:id/assign_employees',departmentController.assignEmployees);

departmentRouter.put('/department/:id',departmentController.updateById);
  
departmentRouter.delete('/department/:id',departmentController.deleteById);

module.exports = departmentRouter;