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