const departmentRepository = {};

const logger = require('../../logger/logger');
const baseRepository = require('../baseRepository');
const sqlQuery = require('./script/sqlQuery');
const format = require('pg-format');

const createDatabaseError = require('../errors/databaseErrors');
const dbPool = require('../../dbPool/dbPool');


departmentRepository.getAll = async function (ids) {
    try {
        return baseRepository.getAll(sqlQuery.getAll,sqlQuery.getByIds,ids)
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


departmentRepository.assignEmployees = async function (arrayIdsEmployeeAndDepartment) {

    if (!arrayIdsEmployeeAndDepartment) throw new Error('One or more parameters undefined');

        const client = await dbPool.connect();
        try {
            const moveEmployeesSql = format(sqlQuery.assignEmployeesToDepartment,arrayIdsEmployeeAndDepartment);
            console.log(moveEmployeesSql)
            logger.debug('Connection completed')
            logger.debug('Start transaction');
    
            await client.query('BEGIN;')
            
            await client.query(moveEmployeesSql)
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


departmentRepository.moveEmployees = async function (departmentId, employeesIds) {

    if (!departmentId || !employeesIds) throw new Error('One or more parameters undefined');

        const client = await dbPool.connect();
        try {
            logger.debug('Connection completed')
            logger.debug('Start transaction');
    
            await client.query('BEGIN;')
            const moveEmployeesSql = format(sqlQuery.moveEmployeesToAnotherDepartment,[departmentId],employeesIds);
            await client.query(moveEmployeesSql)
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
