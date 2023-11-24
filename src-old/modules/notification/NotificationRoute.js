const router = require("express").Router();
const {
  addNotification,
  updateNotification,
  deleteNotification,
  getNotifications,
  getNotificationById,
} = require("./NotificationController");

// NOTIFICATION ENDPOINTS
router.post("/add", addNotification);
router.put("/update/:id", updateNotification);
router.delete("/delete/:id", deleteNotification);
router.get("/get-notifications", getNotifications);
router.get("/get-notification/:id", getNotificationById);

module.exports = router;
