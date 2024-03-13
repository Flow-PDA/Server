module.exports = (sequelize, Sequelize) => {
  // define model
  const Party = sequelize.define(
    // DB table name
    "Party",
    {
      partyKey: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      accountNumber: {
        type: Sequelize.STRING(20),
      },
      name: {
        type: Sequelize.STRING(10),
      },
      deposit: {
        type: Sequelize.BIGINT,
      },
      goal: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      goalPrice: {
        type: Sequelize.BIGINT,
        allowNull: true,
      },
      goalDate: {
        // DATE - DATETIME of MySQL
        type: Sequelize.DATE,
        allowNull: true,
      },
    },
    {
      // column name : camelCase to snake_case
      underscored: true,
      freezeTableName: true,
      timeStamps: true, // default true
    }
  );

  return Party;
};
