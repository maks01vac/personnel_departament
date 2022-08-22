const departmentRepository = {};

const logger = require('../logger/logger');
const baseRepository = require('./baseRepository');
const sqlQuery = require('./const/sqlQuery');

const createDatabaseError = require('./errors/databaseErrors')


departmentRepository.getAll = async function () {
    try {
        return baseRepository.getAll(sqlQuery.department.getAll)
    }
    catch (err) {
        return createDatabaseError.dbConnectionError(err)
    }
}


departmentRepository.getById = async function (departmentId) {

    if (!departmentId) throw new Error('One or more parameters undefined');

    try {
        return baseRepository.getById(departmentId, sqlQuery.department.getById)
    }
    catch (err) {
        return createDatabaseError.dbConnectionError(err)
    }
}

departmentRepository.createNewDepartment = async function (departmentData) {

    if (!departmentData) throw new Error('One or more parameters undefined');

    const { name } = departmentData;

    try {
        return baseRepository.createNewEntry([name], sqlQuery.department.createNewEntry)
    }
    catch (err) {
        return createDatabaseError.dbConnectionError(err)
    }
}

departmentRepository.updateById = async function (departmentId, departmentData) {

    if (!departmentId || !departmentData) throw new Error('One or more parameters undefined');

    const { name } = departmentData

    try {

        const searchResult = await this.getById(departmentId);

        if (searchResult.success === false) {
            return searchResult
        }

        return baseRepository.updateById([name, departmentId], sqlQuery.department.updateById);

    }
    catch (err) {
        return createDatabaseError.dbConnectionError(err)
    }
}

departmentRepository.deleteById = async function (departmentId) {

    if (!departmentId) throw new Error('One or more parameters undefined');

    try {

        const searchResult = await this.getById(departmentId);

        if (searchResult.success === false) {
            return searchResult
        }

        return baseRepository.deleteById(departmentId, sqlQuery.department.deleteById);

    }
    catch (err) {
        return createDatabaseError.dbConnectionError(err)
    }
}


module.exports = departmentRepository;
