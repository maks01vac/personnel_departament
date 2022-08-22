const departmentRepository = {};

const logger = require('../logger/logger');
const baseRepository = require('./baseRepository');

const createDatabaseError = require('./errors/databaseErrors')


departmentRepository.getAll = async function () {
    try {
        return baseRepository.getAll('SELECT id,name FROM department')
    }
    catch (err) {
        return createDatabaseError.dbConnectionError(err)
    }
}


departmentRepository.getById = async function (departmentId) {

    if (!departmentId) throw new Error('One or more parameters undefined');

    try {
        return baseRepository.getById(departmentId, 'SELECT id,name FROM department WHERE id=$1')
    }
    catch (err) {
        return createDatabaseError.dbConnectionError(err)
    }
}

departmentRepository.createNewDepartment = async function (departmentData) {

    if (!departmentData) throw new Error('One or more parameters undefined');

    const { name } = departmentData;

    try {
        return baseRepository.createNewEntry([name], 'INSERT INTO department(name) VALUES($1);')
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

        return baseRepository.updateById([name, departmentId], 'UPDATE department SET name=$1 WHERE id=$2');

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

        return baseRepository.deleteById(departmentId, 'DELETE FROM department WHERE id=$1');

    }
    catch (err) {
        return createDatabaseError.dbConnectionError(err)
    }
}


module.exports = departmentRepository;
