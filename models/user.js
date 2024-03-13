module.exports = (sequelize, Sequelize) => {
  // define model
  const User = sequelize.define(
    // DB table name
    "User",
    {
      userKey: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      email: {
        type: Sequelize.STRING(30),
        unique: true,
      },
      phoneNumber: {
        type: Sequelize.STRING(15),
        // allowNull: true,
      },
      birth: {
        type: Sequelize.STRING(10),
      },
      password: {
        type: Sequelize.STRING,
      },
      name: {
        type: Sequelize.STRING(10),
      },
    },
    {
      // column name : camelCase to snake_case
      underscored: true,
      freezeTableName: true,
      timeStamps: true, // default true
    }
  );

  return User;
};
