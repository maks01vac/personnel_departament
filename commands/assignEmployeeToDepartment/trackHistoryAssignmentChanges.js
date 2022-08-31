const pgFormat = require('pg-format');
const sqlQuery = require('../../repositories/department/script/sqlQuery');

async function trackHistoryDepartmentChange (departmentId, assignEmployeeIds, context){

    const dateNow = new Date();

    const assignEmployeeHistory = assignEmployeeIds.map(employeeId => [dateNow, employeeId, departmentId]);

    const assignEmployeesHistorySql = pgFormat(sqlQuery.insertNewEntryInHistory, assignEmployeeHistory);

    await context.execSql(assignEmployeesHistorySql);

}

module.exports = trackHistoryDepartmentChange