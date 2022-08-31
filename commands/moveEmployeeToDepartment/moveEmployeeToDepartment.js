const pgFormat = require('pg-format');
const sqlQuery = require('../../repositories/department/script/sqlQuery');

async function moveEmployeeToDepartment(departmentId,moveEmployeeIds,context){
    const moveEmployeesSql = pgFormat(sqlQuery.moveEmployeesToAnotherDepartment,
        [departmentId],
        moveEmployeeIds);

    await context.execSql(moveEmployeesSql);
}

module.exports = moveEmployeeToDepartment;