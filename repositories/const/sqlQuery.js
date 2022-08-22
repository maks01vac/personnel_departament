
module.exports = {
    employee: {

        getAll: `SELECT 
                    e.id,
                    firstname,
                    lastname,
                    sex,
                    birthdate,
                    phone,
                    p.id as id_position,
                    p.name as name_position 
                FROM 
                    employees e 
                LEFT JOIN 
                    employee_position ep on e.id=ep.id_employee 
                LEFT JOIN 
                    position p on ep.id_position=p.id`,

        getById: `SELECT 
                    e.id,
                    firstname,
                    lastname,
                    sex,
                    birthdate,
                    phone,
                    p.id as id_position,
                    p.name as name_position 
                FROM 
                    employees e 
                LEFT JOIN 
                    employee_position ep on e.id=ep.id_employee 
                LEFT JOIN 
                    position p on ep.id_position=p.id 
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
    },


    position: {

        getAll: `SELECT
                    id,name 
                 FROM 
                    position`,

        getById: `SELECT
                    id,name 
                  FROM 
                    position
                  WHERE id=$1`,

        createNewEntry: `INSERT INTO 
                            position(name) 
                        VALUES
                            ($1);`,

        updateById:`UPDATE 
                        position 
                    SET 
                        name=$1 
                    WHERE id=$2`,


        deleteById: `DELETE FROM 
                        position 
                     WHERE 
                        id=$1`

    },


    department: {

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

        createNewEntry: `INSERT INTO 
                            department(name) 
                        VALUES
                            ($1);`,

        updateById:`UPDATE 
                        department 
                    SET 
                        name=$1 
                    WHERE id=$2`,


        deleteById: `DELETE FROM 
                        department 
                     WHERE 
                        id=$1`
    }
}