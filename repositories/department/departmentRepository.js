const departmentRepository = {};

const logger = require('../../logger/logger');
const baseRepository = require('../baseRepository');
const sqlQuery = require('./script/sqlQuery');
const pgFormat = require('pg-format');

const createDatabaseError = require('../errors/databaseErrors');
const dbPool = require('../../database/dbPool');

const moveEmployees = async function (client, departmentId, moveEmployeeIds) {

    const dateNow = new Date();

    const moveEmployeesSql = pgFormat(sqlQuery.moveEmployeesToAnotherDepartment,
        [departmentId],
        moveEmployeeIds);
    await client.query(moveEmployeesSql);

    const updateDateToSql = pgFormat(sqlQuery.updateDateTo, moveEmployeeIds)
    await client.query(updateDateToSql, [dateNow]);

    const insertHistoryData = moveEmployeeIds.map(employeeId => [dateNow, employeeId, departmentId]);
    const insertNewHistoryEntrySql = pgFormat(sqlQuery.insertNewEntryInHistory, insertHistoryData)
    await client.query(insertNewHistoryEntrySql);

}

const assignEmployees = async function (client, departmentId, assignEmployeeIds) {

    const assignEmployees = assignEmployeeIds.map(employeeId => [employeeId, departmentId]);

    const dateNow = new Date();

    const assignEmployeeHistory = assignEmployeeIds.map(employeeId => [dateNow, employeeId, departmentId]);


    const assignEmployeesSql = pgFormat(sqlQuery.assignEmployeesToDepartment, assignEmployees);
    const assignEmployeesHistorySql = pgFormat(sqlQuery.insertNewEntryInHistory, assignEmployeeHistory);

    await client.query(assignEmployeesSql);
    await client.query(assignEmployeesHistorySql);

}


departmentRepository.getAll = async function () {
    try {
        return baseRepository.getAll(sqlQuery.getAll)
    }
    catch (err) {
        return createDatabaseError.dbConnectionError(err)
    }
}


departmentRepository.getById = async function (departmentId) {

    if (!departmentId) throw new Error('One or more parameters undefined');

    try {
        return baseRepository.getById(departmentId, sqlQuery.getById)
    }
    catch (err) {
        return createDatabaseError.dbConnectionError(err)
    }
}


departmentRepository.createNewDepartment = async function (departmentData) {

    if (!departmentData) throw new Error('One or more parameters undefined');

    const { name } = departmentData;

    try {
        return baseRepository.createNewEntry([name], sqlQuery.createNewEntry)
    }
    catch (err) {
        return createDatabaseError.dbConnectionError(err)
    }
}



departmentRepository.assignAndMoveEmployees = async function (departmentId, employeeIdsObject) {

    if (!departmentId || !employeeIdsObject) throw new Error('One or more parameters undefined');

    employeeIdsObject.employeesIdsWithDepartment = employeeIdsObject.employeesIdsWithDepartment || [];
    employeeIdsObject.employeesIdsWithoutDepartment = employeeIdsObject.employeesIdsWithoutDepartment || []

    const client = await dbPool.connect();
    try {
        logger.debug('Connection completed')
        logger.debug('Start transaction');

        await client.query('BEGIN;');

        if (employeeIdsObject.employeesIdsWithDepartment.length) {

            await moveEmployees(client, departmentId, employeeIdsObject.employeesIdsWithDepartment)

        }

        if (employeeIdsObject.employeesIdsWithoutDepartment.length) {

            await assignEmployees(client, departmentId, employeeIdsObject.employeesIdsWithoutDepartment)

        }

        await client.query('COMMIT;');

        logger.debug('Transaction was successful');
        return {
            success: true,
        }
    } catch (err) {
        await client.query('ROLLBACK')

        return createDatabaseError.dbError(err);

    } finally {
        client.release()
    }
}


departmentRepository.updateById = async function (departmentId, departmentData) {

    if (!departmentId || !departmentData) throw new Error('One or more parameters undefined');

    const { name } = departmentData

    try {

        const searchResult = await this.getById(departmentId);

        if (searchResult.success === false) {
            return searchResult
        }

        return baseRepository.updateById([name, departmentId], sqlQuery.updateById);

    }
    catch (err) {
        return createDatabaseError.dbConnectionError(err)
    }
}

departmentRepository.deleteById = async function (departmentId) {

    if (!departmentId) throw new Error('One or more parameters undefined');

    try {

        const searchResult = await this.getById(departmentId);

        if (searchResult.success === false) {
            return searchResult
        }

        return baseRepository.deleteById(departmentId, sqlQuery.deleteById);

    }
    catch (err) {
        return createDatabaseError.dbConnectionError(err)
    }
}


module.exports = departmentRepository;
