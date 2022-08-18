const logger = require('../../logger/logger');

const createServiceErrors = {}

createServiceErrors.invalidId = (validationError)=>{
    logger.warn('data has not been validated',validationError.details[0]);

    return { 
        success: false,
        error:{
            details:validationError.details[0],
            errorCode:"INVALID_DATA"
        } ,
    }
}

createServiceErrors.invalidData = (validationError) =>{
    logger.warn('id is not valid',validationError.details[0]);
    return {
        success: false,
        error:{
            details:validationError.details[0],
            errorCode:"INVALID_ID"
        } 
    }
}
createServiceErrors.unexpectedError = (err) =>{
    logger.error('Sorry, an unexpected error occurred.Details:',err)
    return{
        success:false,
        error:{
            errorCode:"UNEXPECTED_ERROR",
            errorMessage:"Sorry, an unexpected error occurred",
            details:{
                errorCodeService:err.code
            }
        }
    }
}
module.exports = createServiceErrors;