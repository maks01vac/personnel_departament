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