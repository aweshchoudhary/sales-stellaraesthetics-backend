const router = require("express").Router();
const { register, login, resetPassword } = require("./AuthController");

// AUTH ENDPOINTS
router.post("/register", register);
router.post("/login", login);
router.post("/reset-password", resetPassword);

module.exports = router;
