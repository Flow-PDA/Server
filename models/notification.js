module.exports = (sequelize, Sequelize) => {
  const Notification = sequelize.define(
    "notification",
    {
      notificationKey: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      userKey: {
        type: Sequelize.INTEGER.UNSIGNED,
        references: {
          model: "user",
          key: "user_key",
        },
      },
      partyKey: {
        type: Sequelize.INTEGER.UNSIGNED,
        references: {
          model: "party",
          key: "party_key",
        },
      },
      type: {
        type: Sequelize.INTEGER(1),
        defaultValue: 0,
      },
      content: {
        type: Sequelize.STRING(30),
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
