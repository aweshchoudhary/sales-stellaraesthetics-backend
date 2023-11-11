const router = require("express").Router();
const {
  getUser,
  updateUser,
  deleteUser,
  getMe,
  getUsers,
} = require("./UserController");

// USER ENDPOINTS
router.get("/getme", getMe);
router.get("/get-users", getUsers);

router.get("/get-user/:id", getUser);
router.delete("/:id", deleteUser);
router.put("/:id", updateUser);
module.exports = router;
