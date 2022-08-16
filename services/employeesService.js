const employeesService ={};

const employeesRepository = require('../repositories/employeesRepository')

employeesService.getAll = async function(){

    const resultGetAllEmployees = await employeesRepository.getAll();
    return resultGetAllEmployees;
}


module.exports = employeesService;