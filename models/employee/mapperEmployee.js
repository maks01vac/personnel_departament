const { array } = require("joi")

const mapperEmployee = {}

mapperEmployee.restructureEmployeeData = function (employeeData) {
    return employeeData.rows.map((employee) => {
        if (employee.id_position === null || employee.name_position === null) {
            return {
                "id": employee.id,
                "firstname": employee.firstname,
                "lastname": employee.lastname,
                "sex": employee.sex,
                "birthdate": employee.birthdate,
                "phone": employee.phone,
                "position": null
            }
        }

        else {
            return {
                "id": employee.id,
                "firstname": employee.firstname,
                "lastname": employee.lastname,
                "sex": employee.sex,
                "birthdate": employee.birthdate,
                "phone": employee.phone,
                "position": {
                    "id": employee.id_position,
                    "name": employee.name_position
                }
            }
        }
    })
}

module.exports = mapperEmployee;
