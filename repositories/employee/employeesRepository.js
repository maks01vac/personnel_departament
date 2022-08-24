const employeesRepository = {};

const dbPool = require('../../dbPool/dbPool');
const logger = require('../../logger/logger');
const mappersEmployee = require('../../models/employee/mapperEmployee');
const baseRepository = require('../baseRepository');
const sqlQuery = require('./script/sqlQuery');

const createDatabaseError = require('../errors/databaseErrors')

employeesRepository.getAll = async function (idsArray) {
    try {

    const resultGetEmployees = await baseRepository.getAll(sqlQuery.getAll,sqlQuery.getByIds,idsArray);

    if(idsArray!==undefined && resultGetEmployees.data.length===0){

        return createDatabaseError.idNotFound(idsArray)

    }

    return resultGetEmployees;
    }
    catch (err) {
        return createDatabaseError.dbConnectionError(err)
    }

}


employeesRepository.getById = async function (employeeId) {

    if (!employeeId) throw new Error('One or more parameters undefined');

    try {

        return await baseRepository.getById(employeeId, sqlQuery.getById);                                    

    }
    catch (err) {

        return createDatabaseError.dbConnectionError(err);

    }


}

employeesRepository.createNewEmployee = async function (employeeData) {

    if (!employeeData) throw new Error('One or more parameters undefined')

    const { firstname, lastname, sex, birthdate, phone } = employeeData

    try {

        return baseRepository.createNewEntry([firstname, lastname, sex, birthdate, phone], sqlQuery.createNewEntry);                                     
    }
    catch (err) {

        return createDatabaseError.dbConnectionError(err);

    }
}

employeesRepository.assignPosition = async function (employeeId, positionData) {

    if (!employeeId || !positionData) throw new Error('One or more parameters undefined')

    const { position: positionId } = positionData;

    try {

        return await baseRepository.createNewEntry([employeeId, positionId], sqlQuery.assignPosition);
            
        
    }
    catch (err) {

        return createDatabaseError.dbConnectionError(err);

    }
}


employeesRepository.updatePosition = async function (employeeId, positionData, currentPosition) {

    if (!employeeId || !positionData || !currentPosition) throw new Error('One or more parameters undefined');

    const { position: positionId } = positionData;

    if (positionId === currentPosition) {
        const errorSamePosition = createDatabaseError.sameEntry(employeeId)
        logger.warn('this employee has the same position', errorSamePosition)
        return errorSamePosition;
    }

    try {

        return baseRepository.updateById([positionId, employeeId], sqlQuery.updatePosition);

    }
    catch (err) {
        return createDatabaseError.dbConnectionError(err)
    }
}


employeesRepository.assignDepartment = async function (employeeId, departmentData) {

    if (!employeeId || !departmentData) throw new Error('One or more parameters undefined')

    const { department: departmentId } = departmentData;

    try {

        return await baseRepository.createNewEntry([employeeId, departmentId], sqlQuery.assignDepartment);
            
    }
    catch (err) {
        return createDatabaseError.dbConnectionError(err);
    }
}


employeesRepository.updateDepartment = async function (employeeId, departmentData, currentDepartment) {

    if (!employeeId || !departmentData || !currentDepartment) throw new Error('One or more parameters undefined');

    const { department: departmentId } = departmentData;

    if (departmentId === currentDepartment) {

        const errorSameDepartment = createDatabaseError.sameEntry(employeeId)

        logger.warn('this employee has the same department', errorSameDepartment)
        return errorSameDepartment;
    }

    try {

        return baseRepository.updateById([departmentId, employeeId], sqlQuery.updateDepartment);

    }
    catch (err) {
        return createDatabaseError.dbConnectionError(err)
    }
}

employeesRepository.updateById = async function (employeeId, employeeData) {

    const { firstname, lastname, sex, birthdate, phone } = employeeData

    try {

        const searchResult = await this.getById(employeeId);

        if (searchResult.success === false) {
            return searchResult;
        }

        return baseRepository.updateById([firstname, lastname, sex, birthdate, phone, employeeId], sqlQuery.updateById);

    }
    catch (err) {
        return createDatabaseError.dbConnectionError(err)
    }
}

employeesRepository.deleteById = async function (employeeId) {

    if (!employeeId) throw new Error('One or more parameters undefined');

    try {

        const searchResult = await this.getById(employeeId);

        if (searchResult.success === false) {
            return searchResult
        }

        return baseRepository.deleteById(employeeId, sqlQuery.deleteById);

    }
    catch (err) {
        return createDatabaseError.dbConnectionError(err)
    }

}


module.exports = employeesRepository;
