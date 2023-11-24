const ActivityModel = require("./ActivityModel");
const NotificationModel = require("../notification/NotificationModel");
const UserModel = require("../user/UserModel");
const ContactModel = require("../contact/ContactModel");
const DealModel = require("../deal/DealModel");
const asyncHandler = require("express-async-handler");
// const transporter = require("../../apps/nodemailer");

const {
  calendar,
  GOOGLE_CALENDAR_ID,
  calendarAuth,
} = require("../../apps/googleCalendar");

const getActivities = asyncHandler(async (req, res) => {
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

  let activities;
  let total = 0;

  const queries = [];

  if (data) {
    queries.push(
      buildQuery(ActivityModel, filtersObj, limit, select, sortObj, start)
    );
  }

  if (count) {
    queries.push(
      ActivityModel.countDocuments(filtersObj)
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
        ActivityModel,
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
        [activities] = results;
      }
    })
    .catch((error) => {
      console.log(error);
    });
  res.status(200).json({ data: activities, meta: { total } });
});
const getActivityById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { select, populate } = req.query;

  if (!id) {
    return res
      .status(400)
      .json({ success: false, message: "Missing activity ID" });
  }

  const activity = await ActivityModel.findById(id)
    .populate(populate)
    .select(select);

  if (!activity) {
    return res
      .status(404)
      .json({ success: false, message: "Activity not found" });
  }

  let result;
  await calendar.events.get(
    {
      calendarId: GOOGLE_CALENDAR_ID,
      eventId: activity.googleEventId,
    },
    (err, res) => {
      if (err) {
        console.error("Error fetching event:", err);
        return;
      }

      const event = res.data;
      result = event;
    }
  );
  console.log(result);

  res.status(200).json({ success: true, data: activity });
});
const addActivity = asyncHandler(async (req, res) => {
  const data = req.body;

  // const contacts = await ContactModel.find({ _id: { $in: data.contacts } });
  const creator = await UserModel.findById(data.creator);

  // if (!contacts.length || !creator)
  //   return res.status(400).json({ message: "Contacts or Creator Required!" });

  // const attendees = contacts.map((c) => ({
  //   id: c.id,
  //   displayName: c.contactPerson,
  //   email: c.email,
  // }));

  const event = {
    summary: data.title,
    location: data.location,
    description: data.description,
    start: {
      dateTime: data.startDateTime,
      timeZone: "Asia/Kolkata",
    },
    end: {
      dateTime: data.endDateTime,
      timeZone: "Asia/Kolkata",
    },
    // attendees,
    creator: {
      id: creator.id,
      email: creator.email,
      displayName: creator.fullname,
    },
    reminders: {
      useDefault: true,
    },
  };
  let googleEventId;
  let googleEventHtmlLink;
  await calendarAuth.getClient().then(async (a) => {
    const result = await calendar.events.insert({
      auth: a,
      calendarId: GOOGLE_CALENDAR_ID,
      resource: event,
    });
    googleEventHtmlLink = result.data.htmlLink;
    googleEventId = result.data.id;
  });
  const newActivity = new ActivityModel({
    ...data,
    googleEventId,
    googleEventHtmlLink,
  });
  const activity = await newActivity.save();

  const updateDealPromises = activity.deals.map(async (deal) => {
    await DealModel.findByIdAndUpdate(deal.toHexString(), {
      $push: { activities: activity.id },
    });
  });
  await Promise.all(updateDealPromises);

  const newNotification1 = new NotificationModel({
    title: "New Activity has been created",
    creator: activity.creator,
    sentTo:
      activity.creator.toHexString() !== activity.performer.toHexString()
        ? [activity.creator, activity.performer]
        : [activity.creator],
  });
  await newNotification1.save();

  if (activity.performer.toHexString() !== activity.creator.toHexString()) {
    const newNotification2 = new NotificationModel({
      title: "You were assigned for activity",
      creator: activity.creator,
      sentTo: [activity.performer],
    });
    await newNotification2.save();
  }
  // const mailOptions = {
  //   from: "aweshchoudhary7@gmail.com",
  //   to: "awesh@stellaraesthetics.in",
  //   subject: "Nodemailer Project",
  //   text: "Hi, this is test email from our backend server, after creating new activity for a deal",
  // };
  // transporter.sendMail(mailOptions, (err, data) => {
  //   if (err) {
  //     console.log("Error " + err);
  //   } else {
  //     console.log("Email sent successfully");
  //   }
  // });
  res
    .status(200)
    .json({ message: "Activity has been added to card", data: activity });
});
const updateActivity = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await ActivityModel.findByIdAndUpdate(id, {
    ...req.body,
  });
  res.status(200).json({ message: "Activity has been updated" });
});
const deleteActivity = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const activity = await ActivityModel.findById(id);

  const updateDealPromises = activity.deals.map(async (deal) => {
    await DealModel.findByIdAndUpdate(deal.toHexString(), {
      $pull: { activities: activity.id },
    });
  });
  await Promise.all(updateDealPromises).then(
    async () => await activity.deleteOne()
  );

  res.status(200).json({ message: "Activity has been deleted" });
});

module.exports = {
  addActivity,
  updateActivity,
  deleteActivity,
  getActivityById,
  getActivities,
};
