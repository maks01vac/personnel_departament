var express = require('express');
var router = express.Router();
var express = require('express');

const positionController = require('../controllers/positionController')

var positionRouter = express.Router();

positionRouter.get('/position',positionController.getAll);

positionRouter.get('/position/:id',positionController.getById);

positionRouter.post('/position',positionController.createNewPosition);

positionRouter.put('/position/:id',positionController.updateById);
  
positionRouter.delete('/position/:id',positionController.deleteById);

module.exports = positionRouter;