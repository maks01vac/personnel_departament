const dbPool = require('./dbPool');

function queryExecutorFactory(dbClient) {
    return {

        execSql: async function (sqlQuery, params) {

            var resultSqlQuery = await dbClient.query(sqlQuery, params);

            return resultSqlQuery

        }
    }
}

const dbConnection = {
    execute: async function (sqlCommand) {
        const dbClient = await dbPool.connect()
        try {
            await dbClient.query('BEGIN;')


            const response = await sqlCommand(queryExecutorFactory(dbClient))

            await dbClient.query('COMMIT');

            return {
                success: true,
                data: response.rows
            }
        }
        catch (err) {

            dbClient.query('ROLLBACK;')
            return{
                success:false,
                error:{
                    details:err
                    
                }
            }
        }
        finally {
            dbClient.release();
        }
    }
}

module.exports = dbConnection