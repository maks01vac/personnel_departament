const config = require('../config/config')
const pool = require('pg').Pool

// или camelCase или snake_case... делай одинаково
const dbPool = new pool(config.database)

module.exports = dbPool; // сюда нужно глобальный catch сделать
