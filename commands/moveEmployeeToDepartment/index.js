const moveEmployeeToDepartment = require("./moveEmployeeToDepartment");
const trackHistoryMovementChanges = require("./trackHistoryMovementChanges");


async function moveEmployeeToDepartmentAndTrackHistory(departmentId,moveEmployeeIds,context){

    await moveEmployeeToDepartment(departmentId,moveEmployeeIds,context);

    await trackHistoryMovementChanges(departmentId,moveEmployeeIds,context);

}
module.exports = moveEmployeeToDepartmentAndTrackHistory