const pgFormat = require('pg-format');
const sqlQuery = require('../../repositories/department/script/sqlQuery');

async function moveEmployeeToDepartment(departmentId,moveEmployeeIds,context){
    const dateNow = new Date();

    const moveEmployeesSql = pgFormat(sqlQuery.moveEmployeesToAnotherDepartment,
        [departmentId],
        moveEmployeeIds);
    await context.execSql(moveEmployeesSql);

    const updateDateToSql = pgFormat(sqlQuery.updateDateTo, moveEmployeeIds)
    await context.execSql(updateDateToSql, [dateNow]);

    const insertHistoryData = moveEmployeeIds.map(employeeId => [dateNow, employeeId, departmentId]);
    const insertNewHistoryEntrySql = pgFormat(sqlQuery.insertNewEntryInHistory, insertHistoryData)
    await context.execSql(insertNewHistoryEntrySql);

}
module.exports = moveEmployeeToDepartment