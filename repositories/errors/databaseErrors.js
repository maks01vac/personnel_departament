const logger = require('../../logger/logger');

const createDatabaseError = {}

createDatabaseError.dbError = (err) => {
    logger.error('Sorry, there was a database error.Details:', err)
    return {
        success: false,
        error: {
            errorMessage: "Sorry, there was a database error",
            errorCode: "ERROR_IN_DATABASE",
            databaseErrorCode: err.code,
        }
    }
}

createDatabaseError.idNotFound = (employeeId) => {
    logger.warn(`Employee with id = ${employeeId} not found`);

    return {
        success: false,
        error: {
            errorMessage: `Employee with id = ${employeeId} not found`,
            errorCode: 'ID_NOT_FOUND',
            details:{
                idEmployee:employeeId
            }
        }
    }
}

module.exports = createDatabaseError