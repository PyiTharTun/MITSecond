const dbConfig = require ("../config/db.config");
const Sequelize = require("sequelize"); // ORM

const sequelize = new Sequelize(
    dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
        host: dbConfig.HOST,
        dialect: dbConfig.dialect,
        pool:{
            max: dbConfig.pool.max,
            min: dbConfig.pool.min,
            acquire: dbConfig.pool.acquire,
            idle: dbConfig.pool.idle
        }
})

const db: any = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.blogs = require('./blogs')(sequelize, Sequelize);
db.users = require('./usermodel')(sequelize,Sequelize);
module.exports = db;