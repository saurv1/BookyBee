const { register, login, forgotPassword, verifyOtp, resetPassword } = require("../controllers/authcontroller");

const Router = require("express").Router();

Router.post("/register", register);
Router.post("/login", login);
Router.put("/forgot-password", forgotPassword);
Router.post("/verify-otp", verifyOtp);
Router.put("/reset-password", resetPassword);
module.exports = Router;