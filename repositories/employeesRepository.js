const employeesRepository = {};

const dbPool = require('../db_pool/db_pool')
const logger = require('../logger/logger');

employeesRepository.getAll = async function () {
    logger.debug('Try to connect to database')
    const client = await dbPool.connect();
    try {
        logger.debug('Cоnnection was completed')
        logger.debug('Start transaction');
        await client.query('BEGIN;')

        const requestToGetAllEmployees = await client.query('SELECT id,firstname,lastname,sex,birthdate,phone FROM employees');

        await client.query('COMMIT;');
        logger.debug('Transaction was successfull');
        return {
            success: true,
            data: requestToGetAllEmployees.rows
        }
    }

    catch (err) {
        logger.error(err, 'error getting all employees from database')
        return {
            success: false,
            error: {
                errorMessage: "Sorry, database is not available",
                errorCode: "ERROR_IN_DATABASE",
            }
        }
    }
    finally {
        client.release()
    }

}


employeesRepository.findEmployeeById = async function (employeeId) {
    try {
        const getUserById = await dbPool.query('SELECT id,firstname,lastname,sex,birthdate,phone FROM employees WHERE id=$1', [employeeId]);

        if (getUserById.rows.length !== 0) {
            return { success: true }
        } else return {
            success: false,
            error: {
                errorMessage: 'employee with this id was not found',
                errorCode: 'ID_NOT_FOUND'
            }

        }
    }
    catch (err) {
        return {
            success: false,
            error: {
                errorMessage: "Sorry, database is not available",
                errorCode: "ERROR_IN_DATABASE",
            }

        }
    }

}


employeesRepository.getById = async function (employeeId) {

    const employeeSearchResult = await this.findEmployeeById(employeeId);

    if (employeeSearchResult.success === false) {
        return employeeSearchResult
    }
    logger.debug('Try to connect to database')
    const client = await dbPool.connect();
    try {
        logger.debug('Cоnnection was completed')
        logger.debug('Start transaction');
        await client.query('BEGIN;');

        const requestToGetEmployeeById = await client.query('SELECT id,firstname,lastname,sex,birthdate,phone FROM employees WHERE id=$1', [employeeId])

        await client.query('COMMIT;');
        logger.debug('Transaction was successfull');
        return {
            success: true,
            data: requestToGetEmployeeById.rows[0]
        }
    }

    catch (err) {
        logger.error(err, 'error getting employee by id from database')
        return {
            success: false,
            error: {
                errorMessage: "Sorry, database is not available",
                errorCode: "errorInDatabase",
            }
        }
    }
    finally {
        client.release()
    }

}

employeesRepository.createNewEmployee = async function (employeeData) {
    const { firstname, lastname, sex, birthdate, phone } = employeeData

    logger.debug('Try to connect to database');
    const client = await dbPool.connect();
    try {
        logger.debug('Cоnnection was completed')
        logger.debug('Start transaction');

        const requestToCreateNewEmployeeInDB = 'INSERT INTO employees(firstname,lastname,sex,birthdate,phone) VALUES($1,$2,$3,$4,$5) RETURNING id'
        await client.query('BEGIN;')

        const queryToCreateNewEmployee = await client.query(requestToCreateNewEmployeeInDB, [firstname, lastname, sex, birthdate, phone]);

        await client.query('COMMIT;');
        logger.debug('Transaction was successfull');
        return {
            success: true,
            data: {
                idNewEmployee: queryToCreateNewEmployee.rows.id
            }
        }
    }

    catch (err) {
        await client.query('ROLLBACK')
        logger.error(err, 'error creating new employee from database')
        return {
            success: false,
            error: {
                errorMessage: "Sorry, database is not available",
                errorCode: "ERROR_IN_DATABASE",
            }
        }
    }
    finally {
        client.release()
    }
}

employeesRepository.updateById = async function (employeeId, employeeData) {
    const { firstname, lastname, sex, birthdate, phone } = employeeData

    const employeeSearchResult = await this.findEmployeeById(employeeId);

    if (employeeSearchResult.success === false) {
        return employeeSearchResult
    }

    logger.debug('Try to connect to database');
    const client = await dbPool.connect();
    try {
        logger.debug('Cоnnection was completed')
        logger.debug('Start transaction');
        await client.query('BEGIN;')

        const requestToUpdateEmployeeByIdInDB = 'UPDATE employees SET firstname = $1, lastname =$2, sex=$3, birthdate=$4,phone=$5 WHERE id=$6'
        const queryToUpdateEmployeeById = await client.query(requestToUpdateEmployeeByIdInDB, [firstname, lastname, sex, birthdate, phone, employeeId])

        await client.query('COMMIT;');
        logger.debug('Transaction was successfull');
        return {
            success: true,
        }
    }

    catch (err) {
        await client.query('ROLLBACK')
        logger.error(err, 'error update employee from database')
        return {
            success: false,
            error: {
                errorMessage: "Sorry, database is not available",
                errorCode: "ERROR_IN_DATABASE",
            }
        }
    }
    finally {
        client.release()
    }
}

employeesRepository.deleteById = async function (employeeId) {
    const employeeSearchResult = await this.findEmployeeById(employeeId);

    if (employeeSearchResult.success === false) {
        return employeeSearchResult
    }

    logger.debug('Try to connect to database');
    const client = await dbPool.connect();
    try {
        logger.debug('Cоnnection was completed')
        logger.debug('Start transaction');
        await client.query('BEGIN;')

        await client.query('DELETE FROM employees WHERE id=$1', [employeeId])

        await client.query('COMMIT;');
        logger.debug('Transaction was successfull');

        return { success: true }

    }
    catch (err) {
        await client.query('ROLLBACK;');

        logger.error(err, 'error delete employee from database')

        return {
            success: false,
            errorMessage: 'Failed to delete data',
            errorCode: 'ERROR_IN_DATABASE'
        }
    }
    finally {
        client.release()
    }

}



module.exports = employeesRepository;