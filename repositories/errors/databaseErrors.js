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

createDatabaseError.positionAlreadyExists =(id)=>{
    return {
        success:false,
        error:{
            errorMessage:`The employee with id=${id} already has a position.If you want to change the position of this employee, select the appropriate method`,
            errorCode:'POSITION_ALREADY_EXISTS',
            details:{
                idEmployee:id
            }
        }
    }
}

createDatabaseError.noPosition =(id)=>{
    return {
        success:false,
        error:{
            errorMessage:`This employee has no position. Please add a position using the appropriate method`,
            errorCode:'NO_POSITION',
            details:{
                idEmployee:id
            }
        }
    }
}

createDatabaseError.samePosition =(id)=>{
    return {
        success:false,
        error:{
            errorMessage:`This employee already has this position`,
            errorCode:'SAME_POSITION',
            details:{
                idEmployee:id
            }
        }
    }
}

module.exports = createDatabaseError