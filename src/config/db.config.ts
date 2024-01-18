module.exports = {
    HOST: "localhost",
    USER: "bkuser",
    PASSWORD: "43772211",
    DB: "bookfirstmit",
    dialect: "postgres",
    pool:{
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
}