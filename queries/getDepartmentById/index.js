const sqlQuery = require('./sql/sql');

module.exports = async function(departmentId,context){

    const getByIdResult = await context.execSql(sqlQuery,[departmentId])

    return  getByIdResult

}