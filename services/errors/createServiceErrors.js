const logger = require('../../logger/logger');

const createServiceErrors = {}

createServiceErrors.invalidId = (validationError)=>{
    logger.warn('Employee data has not been validated',validationError.details[0]);

    return { 
        success: false,
        error:{
            details:validationError.details[0],
            errorCode:"INVALID_DATA"
        } ,
    }
}

createServiceErrors.invalidData = (validationError) =>{
    logger.warn('Employee id is not valid',validationError.details[0]);
    return {
        success: false,
        error:{
            details:validationError.details[0],
            errorCode:"INVALID_ID"
        } 
    }
}

module.exports = createServiceErrors;