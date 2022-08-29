const dbPool = require('../dbPool/dbPool');

const dbConnection = {
    execute: async function (func) {
        const client = await dbPool.connect()
        try {
            client.query('BEGIN;')
            const response = func({
                execSql: async function (sqlQuery, params) {
                    var resultSqlQuery = await client.query(sqlQuery, params);
                    return resultSqlQuery
                }
            })
            client.query('COMMIT')
            return response
        }
        catch (err) {
            client.query('ROLLBACK;')
        }
        finally {
            client.release();
        }
    }
}

async function a() {


    var res = await dbConnection.execute(async ctx => {
        const getAllBefore = await ctx.execSql('SELECT COUNT(*) FROM Employees');
        const insertEmployeeExec =await ctx.execSql(
            `INSERT INTO 
        employees(firstname,lastname,sex,birthdate,phone) 
    VALUES
        ($1,$2,$3,$4,$5) 
    RETURNING 
        id`, ['egrgerg1', 'wegfewg1', 'w', '2010-10-3', '89284718268'])

        const insertEmployeeExec2 =await ctx.execSql(
            `INSERT INTO 
                employees(firstname,lastname,sex,birthdate,phone) 
            VALUES
                ($1,$2,$3,$4,$5) 
            RETURNING 
                id`, ['egrgerg2', 'wegfewg2', 'w'])

        const insertEmployeeExec3 = await ctx.execSql(
            `INSERT INTO 
                    employees(firstname,lastname,sex,birthdate,phone) 
            VALUES
                    ($1,$2,$3,$4,$5) 
            RETURNING 
                id`, ['egrgerg3', 'wegfewg3', 'w', '2010-10-3', '89284718268'])
        const getAllAfter = await ctx.execSql('SELECT COUNT(*) FROM Employees')
        
        console.log(getAllBefore.rows)
        console.log(getAllAfter.rows)
    })
}
a();

