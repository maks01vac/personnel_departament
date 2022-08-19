const employeesRepository = {};

const { func } = require('joi');
const dbPool = require('../dbPool/dbPool')
const logger = require('../logger/logger');
const mappersEmployee = require('../models/employee/mapperEmployee')

const createDatabaseError = require('./errors/databaseErrors')

employeesRepository.getAll = async function () {

    logger.debug('Try to connect to database')

    const client = await dbPool.connect();

    try {

        logger.debug('Connection completed')
        logger.debug('Start transaction');
        await client.query('BEGIN;')

        const requestToGetAllEmployees = await client.query(`SELECT e.id,firstname,lastname,sex,birthdate,phone,p.id as id_position,p.name as name_position FROM employees e LEFT JOIN employee_position ep 
        on e.id=ep.id_employee LEFT JOIN position p on ep.id_position=p.id`);

        await client.query('COMMIT;');

        const employeeDataConversion = mappersEmployee.restructureEmployeeData(requestToGetAllEmployees);
        logger.debug('Transaction was successful');

        return {
            success: true,
            data: employeeDataConversion,
        }

    } catch (err) {

        return createDatabaseError.dbError(err);

    } finally {

        client.release();

    }

}


employeesRepository.getById = async function (employeeId) {

    if(!employeeId) throw new Error('One or more parameters undefined');

    logger.debug('Try to connect to database');
    const client = await dbPool.connect();

    try {

        const requestToGetById = await client.query(`SELECT e.id,firstname,lastname,sex,birthdate,phone,p.id as id_position,p.name as name_position FROM employees e LEFT JOIN employee_position ep 
        on e.id=ep.id_employee LEFT JOIN position p on ep.id_position=p.id WHERE e.id=$1`, [employeeId]);

        const employeeDataConversion = mappersEmployee.restructureEmployeeData(requestToGetById);

        if (employeeDataConversion.length !== 0) {

            return {
                success: true,
                data: employeeDataConversion[0]
            }

        } 
        
        return createDatabaseError.idNotFound(employeeId);


    } catch (err) {

        createDatabaseError.dbError(err);

    } finally {
        client.release()
    }

}

employeesRepository.createNewEmployee = async function (employeeData) {

    if(!employeeData) throw new Error('One or more parameters undefined')

    const { firstname, lastname, sex, birthdate, phone } = employeeData

    logger.debug('Try to connect to database');
    const client = await dbPool.connect();

    try {
        logger.debug('Connection completed')
        logger.debug('Start transaction');

        const newEmployeeSql = 'INSERT INTO employees(firstname,lastname,sex,birthdate,phone) VALUES($1,$2,$3,$4,$5) RETURNING id'
        await client.query('BEGIN;')

        const queryToCreateNewEmployee = await client.query(newEmployeeSql, [firstname, lastname, sex, birthdate, phone]);

        await client.query('COMMIT;');
        logger.debug('Transaction was successful');

        return {
            success: true,
            data: {
                idNewEmployee: queryToCreateNewEmployee.rows[0]
            }
        }

    } catch (err) {

        await client.query('ROLLBACK')
        return createDatabaseError.dbError(err);

    } finally {
        client.release()
    }
}

employeesRepository.assignPosition = async function (employeeId, positionData) {

    if(!employeeId || !positionData) throw new Error('One or more parameters undefined')

    const { position:positionId } = positionData;

    const client = await dbPool.connect();
    try {
        logger.debug('Connection completed')
        logger.debug('Start transaction');

        const assignPositionSql = 'INSERT INTO employee_position(id_employee,id_position) VALUES ($1,$2)'
        await client.query('BEGIN;')

        await client.query(assignPositionSql, [employeeId, positionId]);

        await client.query('COMMIT;');
        logger.debug('Transaction was successful');

        return {
            success: true,
        }

    } catch (err) {

        await client.query('ROLLBACK')
        return createDatabaseError.dbError(err);

    } finally {
        client.release()
    }
}


employeesRepository.updatePosition = async function (employeeId, positionData, currentPosition) {
     
    if(!employeeId || !positionData || !currentPosition) throw new Error('One or more parameters undefined');
    
    const { position:positionId } = positionData;

    if(positionId === currentPosition){
        const errorSamePosition = createDatabaseError.samePosition(employeeId)
        logger.warn('this employee has the same position', errorSamePosition)
        return errorSamePosition;
    }

    const client = await dbPool.connect();
    try {
        logger.debug('Connection completed')
        logger.debug('Start transaction');

        const updatePositionSql = 'UPDATE employee_position SET id_position=$1 WHERE id_employee=$2'
        await client.query('BEGIN;')

        await client.query(updatePositionSql, [positionId, employeeId]);

        await client.query('COMMIT;');
        logger.debug('Transaction was successful');

        return {
            success: true,
        }

    } catch (err) {

        await client.query('ROLLBACK')
        return createDatabaseError.dbError(err);

    } finally {
        client.release()
    }
}

employeesRepository.updateById = async function (employeeId, employeeData) {

    const { firstname, lastname, sex, birthdate, phone } = employeeData

    const employeeSearchResult = await this.getById(employeeId);

    if (employeeSearchResult.success === false) {
        return employeeSearchResult
    }

    logger.debug('Try to connect to database');
    const client = await dbPool.connect();

    try {
        logger.debug('Connection completed')
        logger.debug('Start transaction');

        await client.query('BEGIN;')
        const updateEmployeeSql = 'UPDATE employees SET firstname = $1, lastname =$2, sex=$3, birthdate=$4,phone=$5 WHERE id=$6'
        await client.query(updateEmployeeSql, [firstname, lastname, sex, birthdate, phone, employeeId])
        await client.query('COMMIT;');

        logger.debug('Transaction was successful');
        return {
            success: true,
        }
    } catch (err) {
        await client.query('ROLLBACK')

        return createDatabaseError.dbError(err);

    } finally {
        client.release()
    }
}

employeesRepository.deleteById = async function (employeeId) {
    const employeeSearchResult = await this.getById(employeeId);

    if (employeeSearchResult.success === false) {
        return employeeSearchResult
    }

    logger.debug('Try to connect to database');
    const client = await dbPool.connect();

    try {
        logger.debug('Connection completed')
        logger.debug('Start transaction');

        await client.query('BEGIN;')
        await client.query('DELETE FROM employees WHERE id=$1', [employeeId])
        await client.query('COMMIT;');
        logger.debug('Transaction was successful');

        return { success: true }

    } catch (err) {

        await client.query('ROLLBACK;');
        return createDatabaseError.dbError(err);

    } finally {
        client.release()
    }

}


module.exports = employeesRepository;
