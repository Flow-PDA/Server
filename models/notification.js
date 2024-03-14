module.exports = (sequelize, Sequelize) => {
  const Notification = sequelize.define(
    "Notification",
    {
      notificationKey: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      userKey: {
        type: Sequelize.INTEGER.UNSIGNED,
        references: {
          model: "User",
          key: "user_key",
        },
      },
      partyKey: {
        type: Sequelize.INTEGER.UNSIGNED,
        references: {
          model: "Party",
          key: "party_key",
        },
      },
      type: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      content: {
        type: Sequelize.STRING,
      },
      isViewed: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      underscored: true,
      freezeTableName: true,
      timeStamps: true,
    }
  );
  return Notification;
};
