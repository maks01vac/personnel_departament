const pgFormat = require('pg-format');
const sqlQuery = require('./sql/sql');

async function moveEmployeeToDepartment(departmentId,moveEmployeeIds,context){
    const moveEmployeesSql = pgFormat(sqlQuery.moveEmployeesToAnotherDepartment,
        [departmentId],
        moveEmployeeIds);

    await context.execSql(moveEmployeesSql);
}

module.exports = moveEmployeeToDepartment;