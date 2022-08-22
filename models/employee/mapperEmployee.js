const { array } = require("joi")

const mapperEmployee = {}

mapperEmployee.restructureEmployeeData = function (employeeData) {
    return employeeData.map((employee) => {

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

        } else {
            mappingEmployeeData.position = {
                id: employee.id_position,
                name: employee.name_position
            }
        }


        if (employee.id_department === null || employee.name_department === null) {
            mappingEmployeeData.department = null
       
        }
        else{
            mappingEmployeeData.department = {
                id: employee.id_department,
                name: employee.name_department
            }
        }

        return mappingEmployeeData
    })
}

module.exports = mapperEmployee;
