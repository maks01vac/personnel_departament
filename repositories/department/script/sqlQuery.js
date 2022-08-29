module.exports = {

   getAll: `SELECT 
                id,name 
             FROM 
                department`,

   getById: `SELECT 
                id,name 
             FROM 
                department
             WHERE
                id=$1`,
   updateDateTo: 'UPDATE employee_department_history SET date_to=$1 WHERE id_employee IN (%L) AND date_to IS NULL',

   createNewEntry: `INSERT INTO 
                        department(name) 
                    VALUES
                        ($1);`,

   updateById: `UPDATE 
                    department 
                SET 
                    name=$1 
                WHERE id=$2`,
   assignEmployeesToDepartment:
      `INSERT INTO
                employee_department(id_employee,id_department) 
             VALUES
                %L`,
   insertNewEntryInHistory: `INSERT INTO
                              employee_department_history(date_from,id_employee,id_department)
                           VALUES %L
                           `,
   moveEmployeesToAnotherDepartment: `UPDATE 
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