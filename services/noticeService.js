const { db } = require("../modules");
const Notification = db.Notifications;

module.exports.getNotifications = async (userKey) => {
  try {
    const notices = await Notification.findAll({
      where: {
        userKey: userKey,
      },
    });

    const res = notices.map((notice) => ({
      notificationKey: notice.notificationKey,
      partyKey : notice.partyKey,
      type: notice.type,
      content: notice.content,
      createdAt: notice.createdAt,
      isViewed: notice.isViewed,
    }));

    return res;
  } catch (error) {
    console.error(error);
  }
};

module.exports.getDelNotifications = async (notificationKey) => {
  try {
    const notices = await Notification.destroy({
      where: {
        notificationKey: notificationKey,
        // isViewed : false
      },
    });

    // const res = notices.map((notice) => ({
    //   notificationKey: notice.notificationKey,
    //   type: notice.type,
    //   content: notice.content,
    //   createdAt: notice.createdAt,
    //   isViewed: notice.isViewed,
    // }));

    // return res;
  } catch (error) {
    console.error(error);
  }
};

module.exports.checkNotification = async (notificationKey) => {
  try {
    const notice = await Notification.findOne({
      where: {
        notificationKey: notificationKey,
      },
    });

    await notice.update({ isViewed: true });
    await notice.save();

    return notice;
  } catch (error) {
    console.error(error);
  }
};

module.exports.checkUnNotification = async (userKey) => {
  try {
    const notice = await Notification.findAll({
      where: {
        userKey: userKey,
        isViewed : false
      },
    });

    return notice.length;
  } catch (error) {
    console.error(error);
  }
};

module.exports.checkAllNotification = async (userKey) => {
  try {
    const notices = await Notification.update(
      { isViewed: true },
      {
        where: {
          userKey: userKey,
          isViewed: false,
        },
      }
    );

    return notices;
  } catch (error) {
    console.error(error);
  }
};

const Stock = db.Stocks;
const User = db.Users;
const Transfer = db.TransferDetails;
const Party = db.Parties;

//타입별 컨텐츠
module.exports.ContentByType = async (
  type,
  partyKey = undefined,
  userKey = undefined,
  stockKey = undefined,
  transferKey = undefined
) => {
  let content, party, stock, user, transfer;

  if (partyKey) {
    party = await Party.findOne({
      where: {
        partyKey: partyKey,
      },
    }).then((data) => data.dataValues);
  }

  if (stockKey) {
    stock = await Stock.findOne({
      where: {
        stockKey: stockKey,
      },
    }).then((data) => data.dataValues);
  }

  if (userKey) {
    user = await User.findOne({
      where: {
        userKey: userKey,
      },
    }).then((data) => data.dataValues);
  }

  if (transferKey) {
    transfer = await Transfer.findOne({
      where: {
        transferKey: transferKey,
      },
    }).then((data) => data.dataValues);
  }

  switch (type) {
    case 1: //	투표 등록 알림
      // console.log("party", party);
      content = `${party.name} 모임의 ${stock.stockName} 종목 투표가 등록되었습니다.`;
      break;
    case 2: // 투표 완료 알림 - 수락/거절 둘다?
      content = `${party.name} 모임의 ${stock.stockName} 종목이 승인완료 되었습니다.`;
      break;
    case 3: // 이체 알림
      content = `${party.name} 모임의 ${user.name}님이 ${transfer.price}원을 이체했습니다.`;
      break;
    case 4: // 모임 초대 알림
      content = `${user.name}님이 ${party.name} 모임에 초대했습니다.`;
      break;
    default:
      content = "잘못된 타입 입력";
  }

  return content;
};
