module.exports = {

    database:{
    host:process.env.HOST,
    user:"postgres",
    port:5432,
    password:process.env.DB_PASSWORD,
    database:"postgres"
}

}