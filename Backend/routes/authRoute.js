const { register, login, forgotPassword, verifyOtp, resetPassword, getAllUsers, deleteUser } = require("../controllers/authcontroller");
const isAutenticated = require("../middleware/isAutenticated");
const restrictTo = require("../middleware/restrictTo");

const Router = require("express").Router();

Router.post("/register", register);
Router.post("/login", login);
Router.put("/forgot-password", forgotPassword);
Router.post("/verify-otp", verifyOtp);
Router.put("/reset-password", resetPassword);
Router.get("/users", isAutenticated, restrictTo("admin"), getAllUsers);
Router.delete("/delete/:id", isAutenticated, restrictTo("admin"), deleteUser);
module.exports = Router;