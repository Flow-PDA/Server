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
  // disable logging
  // logging: false,

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
db.PartyMembers = require("../models/partyMember.js")(sequelize, Sequelize);
db.Notifications = require("../models/notification.js")(sequelize, Sequelize);
db.TransactionDetails = require("../models/transactionDetail.js")(sequelize, Sequelize);
db.Stocks = require("../models/stock.js")(sequelize, Sequelize);
db.InterestStocks = require("../models/interestStock.js")(sequelize, Sequelize);
db.Participants = require("../models/participant.js")(sequelize, Sequelize);
db.TransferDetails = require("../models/transferDetail.js")(
  sequelize,
  Sequelize
);
// add new models here

module.exports = db;
