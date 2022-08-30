
const assignEmployeeSql = require('./assignEmployee')
const trackHistoryDepartmentChange = require('./trackHistoryDepartmentChange')


async function assignEmployeeToDepartment(departmentId,assignEmployeeIds,context) {

    await assignEmployeeSql(departmentId,assignEmployeeIds,context);

    await trackHistoryDepartmentChange(departmentId,assignEmployeeIds,context);

}
module.exports = assignEmployeeToDepartment