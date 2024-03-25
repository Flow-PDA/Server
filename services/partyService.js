const { db } = require("../modules");
const Party = db.Parties;
const PartyMember = db.PartyMembers;
/**
 * create party
 * @param {*} partyDto accountNumberm name, deposit, goal, goalPrice, goalDate
 * @returns created Party info
 */
module.exports = async (partyDto) => {
  const res = await Party.create(partyDto);
  return res.dataValues;
};

module.exports.getPartyMember = async (partyKey) => {
  const partyMembers = await PartyMember.findAll({
    where: {
      partyKey: partyKey,
    },
  });

  return partyMembers;
};

module.exports.getPartyAccountNumber = async (partyKey) => {
  const party = await Party.findOne({
    where: {
      partyKey: partyKey,
    },
  });
  return party.accountNumber;
};
