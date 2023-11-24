const NotificationModel = require("./NotificationModel");
const DealModel = require("../deal/DealModel");
const asyncHandler = require("express-async-handler");

// NOTES CONTROLLERS

const getNotifications = asyncHandler(async (req, res) => {
  const { filters, search, sort, limit, select, count, start, data, populate } =
    req.query;

  const filtersObj = filters
    ? JSON.parse(filters).reduce(
        (obj, item) => ({ ...obj, [item.id]: item.value }),
        {}
      )
    : {};
  const sortObj = sort
    ? JSON.parse(sort).reduce(
        (obj, item) => ({ ...obj, [item.id]: item.desc ? "desc" : "asc" }),
        {}
      )
    : {};

  const buildQuery = (model, filtersObj, limit, select, sortObj, start) => {
    return model
      .find(filtersObj)
      .limit(limit || 25)
      .select(select)
      .sort(sortObj)
      .skip(start || 0)
      .populate(populate);
  };

  let notifications = [];
  let total = 0;

  const queries = [];

  if (data) {
    queries.push(
      buildQuery(NotificationModel, filtersObj, limit, select, sortObj, start)
    );
  }

  if (count) {
    queries.push(
      NotificationModel.countDocuments(filtersObj)
        .limit(limit || 25)
        .select(select)
        .sort(sortObj)
        .skip(start || 0)
        .then((count) => {
          total = count;
        })
    );
  }

  if (search) {
    queries.push(
      buildQuery(
        DealModel,
        { $text: { $search: search } },
        limit,
        select,
        sortObj,
        start,
        populate
      )
    );
  }

  await Promise.all(queries)
    .then((results) => {
      if (data) {
        [notifications] = results;
      }
    })
    .catch((error) => {
      console.log(error);
    });
  res.status(200).json({ data: notifications, meta: { total } });
});

const getNotificationById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { select, populate } = req.query;

  if (!id) {
    return res
      .status(400)
      .json({ success: false, message: "Missing notification ID" });
  }

  const notification = await NotificationModel.findById(id)
    .populate(populate)
    .select(select);

  if (!notification) {
    return res
      .status(404)
      .json({ success: false, message: "Notification not found" });
  }

  res.status(200).json({ success: true, data: notification });
});

const addNotification = asyncHandler(async (req, res) => {
  const newNotification = new NotificationModel(req.body);
  const notification = await newNotification.save();
  res.status(200).json({
    message: "Notification has been added to deal",
    data: notification,
  });
});

const updateNotification = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await NotificationModel.findByIdAndUpdate(id, req.body);
  res.status(200).json({ message: "Notification has been updated" });
});
const deleteNotification = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await NotificationModel.findById(id);
  res.status(200).json({ message: "Notification has been deleted" });
});

module.exports = {
  addNotification,
  updateNotification,
  deleteNotification,
  getNotifications,
  getNotificationById,
};
