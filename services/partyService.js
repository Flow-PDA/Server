const { db } = require("../modules");
const Party = db.Parties;
/**
 * create party
 * @param {*} partyDto accountNumberm name, deposit, goal, goalPrice, goalDate
 * @returns created Party info
 */
module.exports = async (partyDto) => {
  const res = await Party.create(partyDto);
  return res.dataValues;
};
