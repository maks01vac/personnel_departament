const { array } = require("joi")

const mapperEmployee = {}

mapperEmployee.restructureEmployeeData = function (employeeData) {
    return employeeData.rows.map((employee) => {

        const mappingEmployeeData = {
            "id": employee.id,
            "firstname": employee.firstname,
            "lastname": employee.lastname,
            "sex": employee.sex,
            "birthdate": employee.birthdate,
            "phone": employee.phone,
        }

        if (employee.id_position === null || employee.name_position === null) {

            mappingEmployeeData.position = null
            return mappingEmployeeData;

        }

        mappingEmployeeData.position = {
            id:employee.id_position,
            name:employee.name_position
        }

        return mappingEmployeeData
    })
}

module.exports = mapperEmployee;