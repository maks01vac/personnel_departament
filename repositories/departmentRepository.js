const departmentRepository = {};

const dbPool = require('../dbPool/dbPool')
const logger = require('../logger/logger');

const createDatabaseError = require('./errors/databaseErrors')


departmentRepository.getAll = async function () {

    logger.debug('Try to connect to database')
    const client = await dbPool.connect();

    try {
        logger.debug('Connection completed')

        const requestToGetAllDepartment = await client.query('SELECT id,name FROM department');

        return {
            success: true,
            data: requestToGetAllDepartment.rows
        }

    } catch (err) {

        return createDatabaseError.dbError(err);

    } finally {
        client.release()
    }

}



departmentRepository.getById = async function (departmentId) {

    logger.debug('Try to connect to database');
    const client = await dbPool.connect();
    try {

        const requestToGetDepartmentById = await client.query('SELECT id,name FROM department WHERE id=$1', [departmentId])

        if (requestToGetDepartmentById.rows.length !== 0) {
            return {
                success: true,
                data: requestToGetDepartmentById.rows[0]
            }
        } else return createDatabaseError.idNotFound(departmentId);


    } catch (err) {

        createDatabaseError.dbError(err);

    } finally {
        client.release()
    }

}

departmentRepository.createNewDepartment = async function (departmentData) {
    const { name } = departmentData

    logger.debug('Try to connect to database');
    const client = await dbPool.connect();
    try {
        logger.debug('Connection completed')
        logger.debug('Start transaction');
        const newDepartmentSql = 'INSERT INTO department(name) VALUES($1);'
        await client.query('BEGIN;')

        const queryToCreateNewDepartment = await client.query(newDepartmentSql, [name]);

        await client.query('COMMIT;');
        logger.debug('Transaction was successful');

        return {
            success: true,
            data: {
                idNewDepartment: queryToCreateNewDepartment.rows[0]
            }
        }

    } catch (err) {

        await client.query('ROLLBACK')
        return createDatabaseError.dbError(err);

    } finally {
        client.release()
    }
}

departmentRepository.updateById = async function (departmentId, departmentData) {

    const { name } = departmentData

    const departmentSearchResult = await this.getById(departmentId);

    if (departmentSearchResult.success === false) {
        return departmentSearchResult
    }

    logger.debug('Try to connect to database');
    const client = await dbPool.connect();

    try {
        logger.debug('Connection completed')
        logger.debug('Start transaction');

        await client.query('BEGIN;')
        const updateDepartmentSql = 'UPDATE department SET name=$1 WHERE id=$2'
        await client.query(updateDepartmentSql, [name, departmentId])
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

departmentRepository.deleteById = async function (departmentId) {
    const departmentSearchResult = await this.getById(departmentId);

    if (departmentSearchResult.success === false) {
        return departmentSearchResult
    }

    logger.debug('Try to connect to database');
    const client = await dbPool.connect();

    try {
        logger.debug('Connection completed')
        logger.debug('Start transaction');

        await client.query('BEGIN;')
        await client.query('DELETE FROM department WHERE id=$1', [departmentId])
        await client.query('COMMIT;');
        logger.debug('Transaction was successful');

        return { success: true }

    } catch (err) {

        await client.query('ROLLBACK;');
        return createDatabaseError.dbError(err);

    } finally {
        client.release()
    }

}


module.exports = departmentRepository;
