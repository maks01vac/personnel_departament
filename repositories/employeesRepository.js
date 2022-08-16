const employeesRepository = {};

const dbPool = require('../db_pool/db_pool')
const logger = require('../logger/logger');

employeesRepository.getAll = async function () {
    const client =await dbPool.connect();
    try {
        const requestToGetAllEmployees = await client.query('SELECT firstname,lastname,sex,birthdate,phone FROM employees')
        return  {
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


module.exports = employeesRepository;