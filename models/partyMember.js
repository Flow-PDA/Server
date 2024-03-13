module.exports = (sequelize, Sequelize) => {
  // define model
  const PartyMember = sequelize.define(
    "Party_Member",
    {
      userKey: {
        type: Sequelize.INTEGER.UNSIGNED,
        references: {
          model: "User",
          key: "user_key",
        },
        // composite PK
        primaryKey: true,
      },
      partyKey: {
        type: Sequelize.INTEGER.UNSIGNED,
        references: {
          model: "Party",
          key: "party_key",
        },
        // composite PK
        primaryKey: true,
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
