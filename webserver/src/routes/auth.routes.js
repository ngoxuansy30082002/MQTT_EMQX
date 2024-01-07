const express = require("express");
const router = express.Router();
const authController = require("../app/controllers/AuthController");

router.get("/login", authController.loginPage);
router.post("/login", authController.login);
router.get("/register", authController.registerPage);
router.post("/register", authController.register);
router.get("/verifyAccount", authController.verifyAccount);
router.get("/forgotpassword", authController.forgotPasswordPage);
router.post("/forgotpassword", authController.forgotPassword);
router.get("/resetpassword", authController.resetPasswordPage);
router.post("/resetpassword", authController.resetPassword);
router.get("/logout", authController.logout);
// router.post("/", emqxController.home);

module.exports = router;
