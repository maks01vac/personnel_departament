const employeesRepository = {};

const dbPool = require('../dbPool/dbPool');
const logger = require('../logger/logger');
const mappersEmployee = require('../models/employee/mapperEmployee');
const baseRepository = require('./baseRepository');
const sqlQuery = require('./const/sqlQuery');

const createDatabaseError = require('./errors/databaseErrors')

employeesRepository.getAll = async function () {
    try {
        return baseRepository.getAll(sqlQuery.employee.getAll)
    }
    catch (err) {
        return createDatabaseError.dbConnectionError(err)
    }

}


employeesRepository.getById = async function (employeeId) {

    if (!employeeId) throw new Error('One or more parameters undefined');

    try {

        return await baseRepository.getById(employeeId, sqlQuery.employee.getById);                                    

    }
    catch (err) {

        return createDatabaseError.dbConnectionError(err);

    }


}

employeesRepository.createNewEmployee = async function (employeeData) {

    if (!employeeData) throw new Error('One or more parameters undefined')

    const { firstname, lastname, sex, birthdate, phone } = employeeData

    try {

        return baseRepository.createNewEntry([firstname, lastname, sex, birthdate, phone], sqlQuery.employee.createNewEntry);                                     
    }
    catch (err) {

        return createDatabaseError.dbConnectionError(err);

    }
}

employeesRepository.assignPosition = async function (employeeId, positionData) {

    if (!employeeId || !positionData) throw new Error('One or more parameters undefined')

    const { position: positionId } = positionData;

    try {

        return await baseRepository.createNewEntry([employeeId, positionId], sqlQuery.employee.assignPosition);
            
        
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

        return baseRepository.updateById([positionId, employeeId], sqlQuery.employee.updatePosition);

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

        return baseRepository.updateById([firstname, lastname, sex, birthdate, phone, employeeId], sqlQuery.employee.updateById);

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

        return baseRepository.deleteById(employeeId, sqlQuery.employee.deleteById);

    }
    catch (err) {
        return createDatabaseError.dbConnectionError(err)
    }

}


module.exports = employeesRepository;
