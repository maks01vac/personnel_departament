const employeesService = {};

const validator = require('../validator/validatesInputData');
const employeesRepository = require('../repositories/employeesRepository')

employeesService.getAll = async function () {

    const resultGetAllEmployees = await employeesRepository.getAll();
    return resultGetAllEmployees;
}

employeesService.getById = async function (id) {

    const validatesId = validator.isNumber(Number(id));

    if (validatesId.error) {
        return {
            success: false,
            error: validatesId.error,
        }
    }

    const resultGetEmployeeById = await employeesRepository.getById(id);
    return resultGetEmployeeById;
}

employeesService.createNewEmployee = async function (employeeData) {

    const resultValidationEmployeeData = validator.employeesSchema(employeeData);
    if (resultValidationEmployeeData.error) {
        return {
            success: false,
            error: resultValidationEmployeeData.error
        }
    }

    const resultCreateNewEmployee = await employeesRepository.createNewEmployee(employeeData);
    return resultCreateNewEmployee
}

employeesService.updateById = async function (id,employeeData) {
    const validatesId = validator.isNumber(Number(id));
    const resultValidationEmployeeData = validator.employeesSchema(employeeData);

    if (validatesId.error) {
        return {
            success: false,
            error: validatesId.error,
        }
    } else if (resultValidationEmployeeData.error) {
        return {
            success: false,
            error: resultValidationEmployeeData.error
        }
    }
    const resultUpdateEmployeeById = employeesRepository.updateById(id,employeeData)

    return resultUpdateEmployeeById;

}

employeesService.deleteById =async function(id){
    const validatesId = validator.isNumber(Number(id));

    if (validatesId.error) {
        return {
            success: false,
            error: validatesId.error,
        }
    }

    const UpdateEmployeeByIdResult = await employeesRepository.deleteById(id);
    return UpdateEmployeeByIdResult;
}



module.exports = employeesService;