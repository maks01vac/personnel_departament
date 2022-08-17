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

createDatabaseError.idNotFound = (id) => {
    logger.warn(`Entry with id = ${id} not found`);

    return {
        success: false,
        error: {
            errorMessage: `Entry with id = ${id} not found`,
            errorCode: 'ID_NOT_FOUND',
            details:{
                entryId:id
            }
        }
    }
}

module.exports = createDatabaseError