const getById = require('./getById')

module.exports = async function(departmentId,context){

    const getByIdResult = await getById(departmentId,context)

    return getByIdResult

}