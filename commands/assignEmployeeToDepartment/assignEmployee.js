const pgFormat = require('pg-format');
const sqlQuery = require('../../repositories/department/script/sqlQuery');

async function assignEmployee (departmentId, assignEmployeeIds, context){
    const assignEmployees = assignEmployeeIds.map(employeeId => [employeeId, departmentId]);

    const assignEmployeesSql = pgFormat(sqlQuery.assignEmployeesToDepartment, assignEmployees);
    
    await context.execSql(assignEmployeesSql)
}

module.exports = assignEmployee