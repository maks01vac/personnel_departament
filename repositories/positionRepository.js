const positionRepository = {};

const dbPool = require('../dbPool/dbPool')
const logger = require('../logger/logger');

const baseRepository = require('./baseRepository');

const createDatabaseError = require('./errors/databaseErrors')


positionRepository.getAll = async function () {
    try {

        return baseRepository.getAll('SELECT id,name FROM position');

    }
    catch (err) {

        return createDatabaseError.dbConnectionError(err);

    }
}



positionRepository.getById = async function (positionId) {

    if (!positionId) throw new Error('One or more parameters undefined');

    try {
        
        return baseRepository.getById(positionId, 'SELECT id,name FROM position WHERE id=$1');

    }
    catch (err) {

        return createDatabaseError.dbConnectionError(err);

    }

}

positionRepository.createNewPosition = async function (positionData) {

    if (!positionData) throw new Error('One or more parameters undefined');

    const { name } = positionData;

    try {

        return baseRepository.createNewEntry([name], 'INSERT INTO position(name) VALUES($1);');

    }
    catch (err) {

        return createDatabaseError.dbConnectionError(err);

    }
}

positionRepository.updateById = async function (positionId, positionData) {
    
    if (!positionId || !positionData) throw new Error('One or more parameters undefined');

    const { name } = positionData

    try {

        const searchResult = await this.getById(positionId);

        if (searchResult.success === false) {
            return searchResult;
        }

        return baseRepository.updateById([name, positionId], 'UPDATE position SET name=$1 WHERE id=$2');

    }
    catch (err) {
        return createDatabaseError.dbConnectionError(err)
    }
}

positionRepository.deleteById = async function (positionId) {
    if (!positionId) throw new Error('One or more parameters undefined');

    try {

        const searchResult = await this.getById(positionId);

        if (searchResult.success === false) {
            return searchResult
        }

        return baseRepository.deleteById(positionId, 'DELETE FROM position WHERE id=$1');

    }
    catch (err) {
        return createDatabaseError.dbConnectionError(err)
    }

}




module.exports = positionRepository;
