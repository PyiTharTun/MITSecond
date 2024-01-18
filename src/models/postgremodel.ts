const dbConfig = require("../config/db.config");
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
// const sequelize = new Sequelize(
//   "postgres://blogs_e4mt_user:CeHRyyis8ZfLgJixYc16bz1hqcU6WHhR@dpg-cm0gu5a1hbls73daha90-a.singapore-postgres.render.com/blogs_e4mt?ssl=true",
//   {
//     dialect: dbConfig.dialect,
//   }
// );

const db: any = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.book = require("./bkmodel")(sequelize, Sequelize);
db.bookdetail = require("./bookDetailmodel")(sequelize, Sequelize);
db.orderdetail = require("./orderDetailmodel")(sequelize, Sequelize);

module.exports = db;
