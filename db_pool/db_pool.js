const config = require('../config/config')
const Pool = require('pg').Pool

const db_pool = new Pool(config.database)

module.exports = db_pool;
