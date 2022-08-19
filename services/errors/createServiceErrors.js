const logger = require('../../logger/logger');

const createServiceErrors = {}

createServiceErrors.invalidId = (validationError) => {

    logger.warn('id is not valid', validationError);

    return {
        success: false,
        error: {
            details: validationError,
            errorCode: "INVALID_ID"
        },
    }
}

createServiceErrors.invalidData = (validationError) => {

    logger.warn('data has not been validated', validationError);

    return {
        success: false,
        error: {
            details: validationError,
            errorCode: "INVALID_DATA"
        }
    }
}
createServiceErrors.unexpectedError = (err) => {

    logger.error('Sorry, an unexpected error occurred.Details:', err)

    return {
        success: false,
        error: {
            errorCode: "UNEXPECTED_ERROR",
            errorMessage: "Sorry, an unexpected error occurred",
            details: {
                errorCodeService: err.code
            }
        }
    }
}
module.exports = createServiceErrors;