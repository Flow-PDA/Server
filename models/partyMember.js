module.exports = (sequelize, Sequelize) => {
  // define model
  const PartyMember = sequelize.define(
    "party_member",
    {
      partyMemberKey: {
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
      role: {
        // 0 for member, 1 for owner
        type: Sequelize.INTEGER(1),
        defaultValue: 0,
      },
      isAccepted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      // column name : camelCase to snake_case
      underscored: true,
      freezeTableName: true,
      timeStamps: true, // default true
    }
  );

  return PartyMember;
};
