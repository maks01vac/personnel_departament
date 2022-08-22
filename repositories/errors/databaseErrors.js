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

    logger.warn(`Entry not found, id:`,id);

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



createDatabaseError.sameEntry =(id)=>{
    return {
        success:false,
        error:{
            errorMessage:`This entry already exists.`,
            errorCode:'SAME_ENTRY',
            details:{
                idEmployee:id
            }
        }
    }
}

module.exports = createDatabaseError