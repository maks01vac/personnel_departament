const departmentService = {};

const validator = require('../validator/validatesInputData');
const departmentRepository = require('../repositories/department/departmentRepository');
const employeesService = require('./employeesService');

const logger = require(
    '../logger/logger');

const createServiceErrors = require('./errors/createServiceErrors')
const departmentSchemaValidator = require('../models/department/schemaValidator');
const { number } = require('joi');



departmentService.getAll = async function (ids) {
    try {
        const resultGetAllDepartment = await departmentRepository.getAll(ids);

        logger.info('The result data is received')

        return resultGetAllDepartment;
    }
    catch (err) {
        return createServiceErrors.unexpectedError(err)
    }
}

departmentService.getById = async function (departmentId) {

    try {
        const validatesId = validator.isNumber(Number(departmentId));

        if (validatesId.error) {
            return createServiceErrors.invalidId(validatesId.error);
        }

        const resultGetDepartmentById = await departmentRepository.getById(departmentId);

        if (resultGetDepartmentById.success) {

            resultGetDepartmentById.data = resultGetDepartmentById.data[0];

        }



        return resultGetDepartmentById;
    }
    catch (err) {
        return createServiceErrors.unexpectedError(err)
    }
}

departmentService.createNewDepartment = async function (departmentData) {
    try {
        const resultValidationDepartmentData = departmentSchemaValidator.validateSchema(departmentData);

        if (resultValidationDepartmentData.error) {
            return createServiceErrors.invalidData(resultValidationDepartmentData.error);
        }

        const resultCreateNewDepartment = await departmentRepository.createNewDepartment(departmentData);
        return resultCreateNewDepartment;
    }
    catch (err) {
        return createServiceErrors.unexpectedError(err);
    }
}


departmentService.assignEmployees = async function (departmentId, employeesIds) {

    try {
        const validatesId = validator.isNumber(departmentId);

        const departmentSearch = await this.getById(departmentId)

        if(departmentSearch.success===false){
            return departmentSearch
        }

        if (validatesId.error) {
            return createServiceErrors.invalidId(validatesId.error);
        }

        let validationErrors

        if (!Array.isArray(employeesIds)) {

            const resultValidatesEmployeeId = departmentSchemaValidator.validateEmployeeId(employeesIds);

            if (resultValidatesEmployeeId.error) {
                return createServiceErrors.invalidData(resultValidatesEmployeeId.error.details[0])
            }

            const searchEmployee = await employeesService.getById(employeesIds.employeeId);

            if (searchEmployee.success === false) {
                return searchEmployee
            }

            if (searchEmployee.data.department === null) {
                return departmentRepository.assignEmployees([[employeesIds.employeeId, departmentId]])
            }

            if (searchEmployee.data.department.id != departmentId) {
                return departmentRepository.moveEmployees(departmentId, [employeesIds.employeeId])
            }

            return { success: true }
        }


        validationErrors = employeesIds.map(employee => {
            const resultValidatesEmployeeIds = departmentSchemaValidator.validateEmployeeId(employee);

            if (resultValidatesEmployeeIds.error) {
                return resultValidatesEmployeeIds.error.details[0]
            }


        });

        const validatesErrorFilters = validationErrors.filter(error => { return error != null })

        if (validatesErrorFilters.length !== 0) {
            return createServiceErrors.invalidData(validationErrors.filter(error => { return error != null }))
        }

        const employeesIdsArray = employeesIds.map(employee=>{
            return employee.employeeId;
        })

        const resultGetByIds = await employeesService.getAll(employeesIdsArray);

        if(resultGetByIds.data.length===0){
            return {
                success:false,
                error:{
                    errorMessage:"Sorry, none of the employees were found",
                    errorCode:"ID_NOT_FOUND"
                }
            }
        }

        const employeeWithoutDepartment = resultGetByIds.data.filter(employee => {
            if(employee.department == null){
                return true
            }
            return false
        })

        const arrayIdsEmployeeWithoutDepartment = employeeWithoutDepartment.map(employee=>{return [employee.id,departmentId]})

        let result1
        if(arrayIdsEmployeeWithoutDepartment.length!==0){
           result1 = await departmentRepository.assignEmployees(arrayIdsEmployeeWithoutDepartment)
        }

        const employeeMoveToAnotherDepartment = resultGetByIds.data.filter(employee => {
            if(employee.department !== null){
                if(employee.department.id!=departmentId){
                    return true
                }
            }
            return false
        })

        const arrayIdsEmployeeWithDepartment = employeeMoveToAnotherDepartment.map(employee=>{return employee.id})

        let result2

        if(arrayIdsEmployeeWithDepartment.length!==0){
           result2 = await departmentRepository.moveEmployees(departmentId, arrayIdsEmployeeWithDepartment)
        }
        return{
            success:true,
            result1:result1,
            result2:result2,
        }

    }

    catch (err) {

        return createServiceErrors.unexpectedError(err)
    }

}


departmentService.updateById = async function (departmentId, departmentData) {
    try {
        const validatesId = validator.isNumber(Number(departmentId));
        const resultValidationDepartmentData = departmentSchemaValidator.validateSchema(departmentData);

        if (validatesId.error) {

            return createServiceErrors.invalidId(validatesId.error);

        } else if (resultValidationDepartmentData.error) {

            return createServiceErrors.invalidData(resultValidationDepartmentData.error);

        }
        const resultUpdateDepartmentById = departmentRepository.updateById(departmentId, departmentData);

        return resultUpdateDepartmentById;
    }
    catch (err) {
        return createServiceErrors.unexpectedError(err)
    }


}

departmentService.deleteById = async function (departmentId) {
    try {
        const validatesId = validator.isNumber(Number(departmentId));

        if (validatesId.error) {
            return createServiceErrors.invalidId(validatesId.error);
        }


        const UpdateDepartmentByIdResult = await departmentRepository.deleteById(departmentId);
        return UpdateDepartmentByIdResult;
    }
    catch (err) {
        return createServiceErrors.unexpectedError(err)
    }
}



module.exports = departmentService;
