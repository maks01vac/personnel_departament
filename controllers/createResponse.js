const mapper = require('./errors/mappers')

const createResponse = function (serviceResult) {

    const statusCode = serviceResult.success
        ? 200
        : mapper.mapErrorCodeToHttpCode(serviceResult.error.errorCode);
    return { statusCode, response: serviceResult };
}

module.exports = createResponse;