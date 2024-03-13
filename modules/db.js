// db module
const dbConfig = require("../app/config/mysql.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  port: dbConfig.port,
  dialect: dbConfig.dialect,
  operatorsAliases: false,

  // logging
  logging: console.log,

  // connection pool
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// model
db.Users = require("../models/user.js")(sequelize, Sequelize);
db.Parties = require("../models/party.js")(sequelize, Sequelize);
db.PartieMembers = require("../models/partyMember.js")(sequelize, Sequelize);

module.exports = db;
