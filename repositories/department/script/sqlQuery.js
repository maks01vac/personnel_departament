module.exports = {
    
    getAll: `SELECT 
                id,name 
             FROM 
                department`,
    getByIds: `SELECT 
                id,name 
             FROM 
                department
             WHERE
               id IN ($1::int[])`,

    getById: `SELECT 
                id,name 
             FROM 
                department
             WHERE
                id=$1`,
   getHistoryChangeDepartmentById: `SELECT 
                date_from,date_to,id_employee,id_department 
             FROM 
                employee_department_history
             WHERE
                id=$1`,

    createNewEntry: `INSERT INTO 
                        department(name) 
                    VALUES
                        ($1);`,

    updateById:`UPDATE 
                    department 
                SET 
                    name=$1 
                WHERE id=$2`,
   assignEmployeesToDepartment:
            `INSERT INTO
                employee_department(id_employee,id_department) 
             VALUES
                %L`,
   assignEmployeesHistory:`INSERT INTO
                              employee_department_history(date_from,id_employee,id_department)
                           VALUES %L
                           `,
   moveEmployeesToAnotherDepartment:`UPDATE 
                        employee_department 
                     SET 
                        id_department=%L 
                     WHERE 
                        id_employee IN (%L)`,


    deleteById: `DELETE FROM 
                    department 
                 WHERE 
                    id=$1`
}