const createDbError = require('../../repositories/errors/databaseErrors');
const sqlQuery = require('../../repositories/department/script/sqlQuery');

module.exports = async function (departmentId,context){

    const getByIdResult = await context.execSql(sqlQuery.getById,[departmentId])

    return  getByIdResult

}