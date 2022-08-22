const employeesRepository = {};

const dbPool = require('../dbPool/dbPool');
const logger = require('../logger/logger');
const mappersEmployee = require('../models/employee/mapperEmployee');
const baseRepository = require('./baseRepository');

const createDatabaseError = require('./errors/databaseErrors')

employeesRepository.getAll = async function () {
    try {
        return baseRepository.getAll(`SELECT 
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
            position p on ep.id_position=p.id`)
    }
    catch (err) {
        return createDatabaseError.dbConnectionError(err)
    }

}


employeesRepository.getById = async function (employeeId) {

    if (!employeeId) throw new Error('One or more parameters undefined');

    try {

        return await baseRepository.getById(employeeId,  
        `SELECT 
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
            e.id=$1`);                                    

    }
    catch (err) {

        return createDatabaseError.dbConnectionError(err);

    }


}

employeesRepository.createNewEmployee = async function (employeeData) {

    if (!employeeData) throw new Error('One or more parameters undefined')

    const { firstname, lastname, sex, birthdate, phone } = employeeData

    try {

        return baseRepository.createNewEntry([firstname, lastname, sex, birthdate, phone],   
       `INSERT INTO 
            employees(firstname,lastname,sex,birthdate,phone) 
        VALUES
            ($1,$2,$3,$4,$5) 
        RETURNING 
            id`);                                     
    }
    catch (err) {

        return createDatabaseError.dbConnectionError(err);

    }
}

employeesRepository.assignPosition = async function (employeeId, positionData) {

    if (!employeeId || !positionData) throw new Error('One or more parameters undefined')

    const { position: positionId } = positionData;

    try {

        return await baseRepository.createNewEntry([employeeId, positionId],   
       `INSERT INTO 
            employee_position(id_employee,id_position) 
        VALUES 
            ($1,$2)`);
            
        
    }
    catch (err) {

        return createDatabaseError.dbConnectionError(err);

    }
}


employeesRepository.updatePosition = async function (employeeId, positionData, currentPosition) {

    if (!employeeId || !positionData || !currentPosition) throw new Error('One or more parameters undefined');

    const { position: positionId } = positionData;

    if (positionId === currentPosition) {
        const errorSamePosition = createDatabaseError.sameEntry(employeeId)
        logger.warn('this employee has the same position', errorSamePosition)
        return errorSamePosition;
    }

    try {

        return baseRepository.updateById([positionId, employeeId], 
           `UPDATE 
                employee_position 
            SET 
                id_position=$1 
            WHERE 
                id_employee=$2`);

    }
    catch (err) {
        return createDatabaseError.dbConnectionError(err)
    }
}

employeesRepository.updateById = async function (employeeId, employeeData) {

    const { firstname, lastname, sex, birthdate, phone } = employeeData

    try {

        const searchResult = await this.getById(employeeId);

        if (searchResult.success === false) {
            return searchResult;
        }

        return baseRepository.updateById([firstname, lastname, sex, birthdate, phone, employeeId], 
            `UPDATE 
                employees 
             SET 
                firstname = $1, 
                lastname =$2, 
                sex=$3, 
                birthdate=$4,
                phone=$5 
            WHERE 
                id=$6`);

    }
    catch (err) {
        return createDatabaseError.dbConnectionError(err)
    }
}

employeesRepository.deleteById = async function (employeeId) {

    if (!employeeId) throw new Error('One or more parameters undefined');

    try {

        const searchResult = await this.getById(employeeId);

        if (searchResult.success === false) {
            return searchResult
        }

        return baseRepository.deleteById(employeeId, 'DELETE FROM employees WHERE id=$1');

    }
    catch (err) {
        return createDatabaseError.dbConnectionError(err)
    }

}


module.exports = employeesRepository;
