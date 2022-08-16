const employeesRepository = {};

const dbPool = require('../db_pool/db_pool')
const logger = require('../logger/logger');

employeesRepository.getAll = async function () {
    const client = await dbPool.connect();
    try {
        const requestToGetAllEmployees = await client.query('SELECT id,firstname,lastname,sex,birthdate,phone FROM employees')
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
                errorCode: "errorInDatabase",
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
                errorCode: 'idNotFound'
            }

        }
    }
    catch (err) {
        return {
            success: false,
            error: {
                errorMessage: "Sorry, database is not available",
                errorCode: "errorInDatabase",
            }

        }
    }

}


employeesRepository.getById = async function (employeeId) {

    const employeeSearchResult = await this.findEmployeeById(employeeId);

    if (employeeSearchResult.success === false) {
        return employeeSearchResult
    }

    const client = await dbPool.connect();
    try {
        const requestToGetEmployeeById = await client.query('SELECT id,firstname,lastname,sex,birthdate,phone FROM employees WHERE id=$1', [employeeId])
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

    const client = await dbPool.connect();
    try {
        const requestToCreateNewEmployeeInDB = 'INSERT INTO employees(firstname,lastname,sex,birthdate,phone) VALUES($1,$2,$3,$4,$5) RETURNING id'
        await client.query('BEGIN;')
        const queryToCreateNewEmployee = await client.query(requestToCreateNewEmployeeInDB, [firstname, lastname, sex, birthdate, phone])
        console.log(queryToCreateNewEmployee);
        await client.query('COMMIT;')
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
                errorCode: "errorInDatabase",
            }
        }
    }
    finally {
        client.release()
    }
}

employeesRepository.updateById = async function (employeeId,employeeData) {
    const { firstname, lastname, sex, birthdate, phone } = employeeData

    const employeeSearchResult = await this.findEmployeeById(employeeId);

    if (employeeSearchResult.success === false) {
        return employeeSearchResult
    }

    const client = await dbPool.connect();
    try {
        await client.query('BEGIN;')

        const requestToUpdateEmployeeByIdInDB = 'UPDATE employees SET firstname = $1, lastname =$2, sex=$3, birthdate=$4,phone=$5 WHERE id=$6'
        const queryToUpdateEmployeeById = await client.query(requestToUpdateEmployeeByIdInDB, [firstname, lastname, sex, birthdate, phone,employeeId])
        
        await client.query('COMMIT;')
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
                errorCode: "errorInDatabase",
            }
        }
    }
    finally {
        client.release()
    }
}

employeesRepository.deleteById =async function(employeeId){
    const employeeSearchResult = await this.findEmployeeById(employeeId);

    if (employeeSearchResult.success === false) {
        return employeeSearchResult
    }
    
    const client = await dbPool.connect()
    try {
        await client.query('BEGIN;')

        await client.query('DELETE FROM employees WHERE id=$1', [employeeId])

        await client.query('COMMIT;')

        return { success: true }

    }
    catch (err) {
        await client.query('ROLLBACK;');

        logger.error(err, 'error delete employee from database')

        return {
            success: false,
            errorMessage: 'Failed to delete data',
            errorCode: 'errorInDatabase'
        }
    }
    finally {
        client.release()
    }

}



module.exports = employeesRepository;