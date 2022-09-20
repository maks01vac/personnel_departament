module.exports = {
    assignEmployeesToDepartment:
    `INSERT INTO
        employee_department(id_employee,id_department) 
     VALUES
        %L`,

    insertNewEntryInHistory:
    `INSERT INTO
        employee_department_history(date_from,id_employee,id_department)
    VALUES %L`
}