
const assignEmployeeSql = require('./assignEmployee')
const trackHistoryDepartmentChange = require('./trackHistoryAssignmentChanges')


async function assignEmployeeToDepartment(departmentId,assignEmployeeIds,context) {

    await assignEmployeeSql(departmentId,assignEmployeeIds,context);

    await trackHistoryDepartmentChange(departmentId,assignEmployeeIds,context);

}
module.exports = assignEmployeeToDepartment