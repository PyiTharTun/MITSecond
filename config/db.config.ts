module.exports = {
    HOST: "localhost",
    USER: "newpeter",
    PASSWORD: "437722",
    DB: "panwar",
    dialect: "postgres",
    pool:{
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
}