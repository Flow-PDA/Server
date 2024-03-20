const { db } = require("../modules");
const Notification = db.Notifications;

module.exports.getNotifications = async (userKey) => {
  try {
    const notices = await Notification.findAll({
      where: {
        userKey: userKey,
        isViewed: false,
      },
    });

    const res = notices.map((notice) => ({
      notificationKey: notice.notificationKey,
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
