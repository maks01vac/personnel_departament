module.exports ={

    getAll: `SELECT 
                e.id,
                firstname,
                lastname,
                sex,
                birthdate,
                phone,
                p.id as id_position,
                p.name as name_position,
                d.id as id_department,
                d.name as name_department 
            FROM 
                employees e 
            LEFT JOIN 
                employee_position ep on e.id=ep.id_employee 
            LEFT JOIN 
                position p on ep.id_position=p.id
            LEFT JOIN 
                employee_department ed on e.id=ed.id_employee
            LEFT JOIN 
                department d on ed.id_department=d.id`,

    getById: `SELECT 
                e.id,
                firstname,
                lastname,
                sex,
                birthdate,
                phone,
                p.id as id_position,
                p.name as name_position,
                d.id as id_department,
                d.name as name_department 
            FROM 
                employees e 
            LEFT JOIN 
                employee_position ep on e.id=ep.id_employee 
            LEFT JOIN 
                position p on ep.id_position=p.id
            LEFT JOIN 
                employee_department ed on e.id=ed.id_employee
            LEFT JOIN 
                department d on ed.id_department=d.id 
            WHERE 
                e.id=$1`,

    createNewEntry: `INSERT INTO 
                            employees(firstname,lastname,sex,birthdate,phone) 
                        VALUES
                            ($1,$2,$3,$4,$5) 
                        RETURNING 
                            id`,

    assignPosition: `INSERT INTO 
                            employee_position(id_employee,id_position) 
                         VALUES 
                            ($1,$2)`,

    updatePosition: `UPDATE 
                        employee_position 
                     SET 
                        id_position=$1 
                     WHERE 
                        id_employee=$2`,

    assignDepartment: `INSERT INTO 
                          employee_department(id_employee,id_department) 
                       VALUES 
                          ($1,$2)`,

    updateDepartment: `UPDATE 
                        employee_department 
                    SET 
                        id_department=$1 
                    WHERE 
                        id_employee=$2`,

    updateById:`UPDATE 
                    employees 
                SET 
                    firstname = $1, 
                    lastname =$2, 
                    sex=$3, 
                    birthdate=$4,
                    phone=$5 
                WHERE 
                    id=$6`,


    deleteById: `DELETE 
                FROM 
                    employees 
                WHERE 
                    id=$1`
}