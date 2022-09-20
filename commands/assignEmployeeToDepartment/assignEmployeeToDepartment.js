const pgFormat = require('pg-format');
const sqlQuery = require('./sql/sql');

async function assignEmployeeToDepartment (departmentId, assignEmployeeIds, context){
    const assignEmployees = assignEmployeeIds.map(employeeId => [employeeId, departmentId]);

    const assignEmployeesSql = pgFormat(sqlQuery.assignEmployeesToDepartment, assignEmployees);
    
    await context.execSql(assignEmployeesSql)
}

module.exports = assignEmployeeToDepartment