const pgFormat = require('pg-format');
const sqlQuery = require('../../repositories/department/script/sqlQuery');

async function trackHistoryMovementChanges(departmentId,moveEmployeeIds,context){
    const dateNow = new Date();

    const updateDateToSql = pgFormat(sqlQuery.updateDateTo, moveEmployeeIds)
    await context.execSql(updateDateToSql, [dateNow]);

    const insertHistoryData = moveEmployeeIds.map(employeeId => [dateNow, employeeId, departmentId]);
    const insertNewHistoryEntrySql = pgFormat(sqlQuery.insertNewEntryInHistory, insertHistoryData)
    await context.execSql(insertNewHistoryEntrySql);
}

module.exports = trackHistoryMovementChanges;