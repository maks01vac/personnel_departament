
const assignEmployeeToDepartment = require('./assignEmployeeToDepartment')
const trackHistoryAssignmentChanges = require('./trackHistoryAssignmentChanges')


async function assignEmployeeToDepartmentAndTrackHistory(departmentId,assignEmployeeIds,context) {

    await assignEmployeeToDepartment(departmentId,assignEmployeeIds,context);

    await trackHistoryAssignmentChanges(departmentId,assignEmployeeIds,context);

}
module.exports = assignEmployeeToDepartmentAndTrackHistory