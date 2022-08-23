const baseRepository = {};

const dbPool = require('../dbPool/dbPool')
const logger = require('../logger/logger');
const format = require('pg-format');

const createDatabaseError = require('./errors/databaseErrors')


baseRepository.getAll = async function (sqlQuery,sqlByIds,idsArray) {

    logger.debug('Try to connect to database')
    const client = await dbPool.connect();

    try {
        logger.debug('Connection completed')
        let requestToGetAll;

        if(idsArray!==undefined && sqlByIds!==undefined){
            const sqlQueryGetByIds = format(sqlByIds,idsArray)
            requestToGetAll = await client.query(sqlQueryGetByIds);

        }else{

            requestToGetAll = await client.query(sqlQuery);

        }

        return {
            success: true,
            data: requestToGetAll.rows
        }

    } catch (err) {

        return createDatabaseError.dbError(err);

    } finally {
        client.release()
    }

}



baseRepository.getById = async function (id,sqlQuery) {

    logger.debug('Try to connect to database');
    const client = await dbPool.connect();
    try {

        const requestToGetById = await client.query(sqlQuery, [id])

        if (requestToGetById.rows.length !== 0) {
            return {
                success: true,
                data: requestToGetById.rows
            }
        } else return createDatabaseError.idNotFound(id);


    } catch (err) {

        createDatabaseError.dbError(err);

    } finally {
        client.release()
    }

}

baseRepository.createNewEntry = async function (data,sqlQuery) {

    logger.debug('Try to connect to database');
    const client = await dbPool.connect();
    try {
        logger.debug('Connection completed')
        logger.debug('Start transaction');
        const newEntrySql = sqlQuery;
        await client.query('BEGIN;');

        const queryToCreateNewEntry = await client.query(newEntrySql, data);

        await client.query('COMMIT;');
        logger.debug('Transaction was successful');

        return {
            success: true,
            data: {
                idNewEntry: queryToCreateNewEntry.rows[0]
            }
        }

    } catch (err) {

        await client.query('ROLLBACK')
        return createDatabaseError.dbError(err);

    } finally {
        client.release()
    }
}

baseRepository.updateById = async function (data,sqlQuery) {

    logger.debug('Try to connect to database');
    const client = await dbPool.connect();

    try {
        logger.debug('Connection completed')
        logger.debug('Start transaction');

        await client.query('BEGIN;')
        const updateSql = sqlQuery;
        await client.query(updateSql, data)
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

baseRepository.deleteById = async function (id,sqlQuery) {

    logger.debug('Try to connect to database');
    const client = await dbPool.connect();

    try {
        logger.debug('Connection completed')
        logger.debug('Start transaction');

        await client.query('BEGIN;')

        await client.query(sqlQuery, [id])

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

module.exports = baseRepository;