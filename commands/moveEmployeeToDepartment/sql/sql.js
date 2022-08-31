module.exports = {
    moveEmployeesToAnotherDepartment:
        `UPDATE 
        employee_department 
     SET 
        id_department=%L 
     WHERE 
        id_employee IN (%L)`,
    updateDateTo: ` UPDATE 
                        employee_department_history 
                    SET 
                        date_to=$1 
                    WHERE 
                        id_employee IN (%L) 
                    AND 
                        date_to IS NULL`,
    insertNewEntryInHistory: `
    INSERT INTO
        employee_department_history(date_from,id_employee,id_department)
    VALUES 
        %L,`
}