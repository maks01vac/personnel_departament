const departmentService = {};

const validator = require('../validator/validatesInputData');
const departmentRepository = require('../repositories/department/departmentRepository');
const employeesService = require('./employeesService');


const logger = require('../logger/logger');

const createServiceErrors = require('./errors/createServiceErrors')
const departmentSchemaValidator = require('../models/department/schemaValidator');
const dbConnection = require('../database/dbConnection');
const assignEmployeeToDepartment = require('../commands/assignEmployeeToDepartment');
const moveEmployeeToDepartment = require('../commands/moveEmployeeToDepartment');




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
        employeesIds = [employeesIds].flat();

        const validatesId = validator.isNumber(departmentId);

        if (validatesId.error) {
            return createServiceErrors.invalidId(validatesId.error);
        }

        const departmentSearch = await this.getById(departmentId)

        if (departmentSearch.success === false) {
            return departmentSearch
        }

        const validationErrors = employeesIds.map(departmentSchemaValidator.validateEmployeeId);

        const validatesErrorFilters = validationErrors.filter(item => item.error)

        if (validatesErrorFilters.length !== 0) {
            return createServiceErrors.invalidData(validatesErrorFilters)
        }

        const employeesIdsArray = employeesIds.map(employee => employee.employeeId)
        const foundEmployees = await employeesService.getAll(employeesIdsArray);

        const employeesToAssign = foundEmployees.data.filter(employee => employee.department == null)
        const employeesToMove = foundEmployees.data.filter(employee => employee.department && employee.department.id !== departmentId);


        dbConnection.execute(async context => {
            if (employeesToAssign.length) {
                const idEmployeesToAssign = employeesToAssign.map(employee => employee.id)
                assignEmployeeToDepartment(departmentId, idEmployeesToAssign, context)
            }
            if (employeesToMove.length) {
                const idEmployeesToMove = employeesToMove.map(employee => employee.id)
                moveEmployeeToDepartment(departmentId, idEmployeesToMove, context)
            }
        })
        return {
            success: true
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
