const employeesRepository = {};

const dbPool = require('../dbPool/dbPool')
const logger = require('../logger/logger');

const createDatabaseError = require('./errors/databaseErrors')

employeesRepository.getAll = async function () {

    logger.debug('Try to connect to database')

    const client = await dbPool.connect();

    try {
        logger.debug('Connection completed')
        logger.debug('Start transaction');
        await client.query('BEGIN;')

        const requestToGetAllEmployees = await client.query('ELECT id,firstname,lastname,sex,birthdate,phone FROM employees');

        await client.query('COMMIT;');

        logger.debug('Transaction was successful');

        return {
            success: true,
            data: requestToGetAllEmployees.rows
        }

    } catch (err) {

        return createDatabaseError(err);

    } finally {
        client.release()
    }

}


employeesRepository.getById = async function (employeeId) {

    logger.debug('Try to connect to database');
    const client = await dbPool.connect();
    try {

        const requestToGetEmployeeById = await client.query('SELECT id,firstname,lastname,sex,birthdate,phone FROM employees WHERE id=$1', [employeeId])

        if (requestToGetEmployeeById.rows.length !== 0) {
            return {
                success: true,
                data: requestToGetEmployeeById.rows[0]
            }
        } else return createDatabaseError.idNotFound(employeeId);


    } catch (err) {

        createDatabaseError(err);

    } finally {
        client.release()
    }

}

employeesRepository.createNewEmployee = async function (employeeData) {
    const { firstname, lastname, sex, birthdate, phone } = employeeData

    logger.debug('Try to connect to database');
    const client = await dbPool.connect();
    try {
        logger.debug('Connection completed')
        logger.debug('Start transaction');

        const requestToCreateNewEmployeeInDB = 'INSERT INTO employees(firstname,lastname,sex,birthdate,phone) VALUES($1,$2,$3,$4,$5) RETURNING id'
        await client.query('BEGIN;')

        const queryToCreateNewEmployee = await client.query(requestToCreateNewEmployeeInDB, [firstname, lastname, sex, birthdate, phone]);

        await client.query('COMMIT;');
        logger.debug('Transaction was successful');

        return {
            success: true,
            data: {
                idNewEmployee: queryToCreateNewEmployee.rows[0]
            }
        }

    } catch (err) {

        await client.query('ROLLBACK')
        return createDatabaseError(err);

    } finally {
        client.release()
    }
}

employeesRepository.updateById = async function (employeeId, employeeData) {

    const { firstname, lastname, sex, birthdate, phone } = employeeData

    const employeeSearchResult = await this.getById(employeeId);

    if (employeeSearchResult.success === false) {
        return employeeSearchResult
    }

    logger.debug('Try to connect to database');
    const client = await dbPool.connect();

    try {
        logger.debug('Connection completed')
        logger.debug('Start transaction');

        await client.query('BEGIN;')
        const updateEmployeeSql = 'UPDATE employees SET firstname = $1, lastname =$2, sex=$3, birthdate=$4,phone=$5 WHERE id=$6'
        await client.query(updateEmployeeSql, [firstname, lastname, sex, birthdate, phone, employeeId])
        await client.query('COMMIT;');

        logger.debug('Transaction was successful');
        return {
            success: true,
        }
    } catch (err) {
        await client.query('ROLLBACK')

        return createDatabaseError(err);

    } finally {
        client.release()
    }
}

employeesRepository.deleteById = async function (employeeId) {
    const employeeSearchResult = await this.getById(employeeId);

    if (employeeSearchResult.success === false) {
        return employeeSearchResult
    }

    logger.debug('Try to connect to database');
    const client = await dbPool.connect();

    try {
        logger.debug('Connection completed')
        logger.debug('Start transaction');

        await client.query('BEGIN;')
        await client.query('DELETE FROM employees WHERE id=$1', [employeeId])
        await client.query('COMMIT;');
        logger.debug('Transaction was successful');

        return { success: true }

    } catch (err) {

        await client.query('ROLLBACK;');
        return createDatabaseError(err);

    } finally {
        client.release()
    }

}


module.exports = employeesRepository;
