const positionRepository = {};

const dbPool = require('../dbPool/dbPool')
const logger = require('../logger/logger');

const createDatabaseError = require('./errors/databaseErrors')


positionRepository.getAll = async function () {

    logger.debug('Try to connect to database')
    const client = await dbPool.connect();

    try {
        logger.debug('Connection completed')

        const requestToGetAllPosition = await client.query('SELECT id,name FROM position');

        return {
            success: true,
            data: requestToGetAllPosition.rows
        }

    } catch (err) {

        return createDatabaseError.dbError(err);

    } finally {
        client.release()
    }

}



positionRepository.getById = async function (positionId) {

    logger.debug('Try to connect to database');
    const client = await dbPool.connect();
    try {

        const requestToGetPositionById = await client.query('SELECT id,name FROM position WHERE id=$1', [positionId])

        if (requestToGetPositionById.rows.length !== 0) {
            return {
                success: true,
                data: requestToGetPositionById.rows[0]
            }
        } else return createDatabaseError.idNotFound(positionId);


    } catch (err) {

        createDatabaseError.dbError(err);

    } finally {
        client.release()
    }

}

positionRepository.createNewPosition = async function (positionData) {
    const { name } = positionData

    logger.debug('Try to connect to database');
    const client = await dbPool.connect();
    try {
        logger.debug('Connection completed')
        logger.debug('Start transaction');
        const newPositionSql = 'INSERT INTO position(name) VALUES($1);'
        await client.query('BEGIN;')

        const queryToCreateNewPosition = await client.query(newPositionSql, [name]);

        await client.query('COMMIT;');
        logger.debug('Transaction was successful');

        return {
            success: true,
            data: {
                idNewPosition: queryToCreateNewPosition.rows[0]
            }
        }

    } catch (err) {

        await client.query('ROLLBACK')
        return createDatabaseError.dbError(err);

    } finally {
        client.release()
    }
}

positionRepository.updateById = async function (positionId, positionData) {

    const { name } = positionData

    const positionSearchResult = await this.getById(positionId);

    if (positionSearchResult.success === false) {
        return positionSearchResult
    }

    logger.debug('Try to connect to database');
    const client = await dbPool.connect();

    try {
        logger.debug('Connection completed')
        logger.debug('Start transaction');

        await client.query('BEGIN;')
        const updatePositionSql = 'UPDATE position SET name=$1 WHERE id=$2'
        await client.query(updatePositionSql, [name, positionId])
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

positionRepository.deleteById = async function (positionId) {
    const positionSearchResult = await this.getById(positionId);

    if (positionSearchResult.success === false) {
        return positionSearchResult
    }

    logger.debug('Try to connect to database');
    const client = await dbPool.connect();

    try {
        logger.debug('Connection completed')
        logger.debug('Start transaction');

        await client.query('BEGIN;')
        await client.query('DELETE FROM position WHERE id=$1', [positionId])
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


module.exports = positionRepository;
