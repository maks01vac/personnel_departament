module.exports ={

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

}