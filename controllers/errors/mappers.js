const mappers = {};

mappers.mapErrorCodeToHttpCode = function (code) {
    let statusCode
    switch (code) {
        case 'INVALID_ID':
        case 'INVALID_DATA':
            statusCode = 400;
            break;
        case 'ID_NOT_FOUND':
            statusCode = 404;
            break;
        case 'ERROR_IN_DATABASE':
            statusCode = 500;

        default:
            statusCode = 500;
    }

    return statusCode;
}

module.exports = mappers;