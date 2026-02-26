const { register, login, forgotPassword, verifyOtp, resetPassword, getAllUsers, deleteUser, toggleAvailability, updateProfile, changePassword, getUserDetails } = require("../controllers/authcontroller");
const isAutenticated = require("../middleware/isAutenticated");
const restrictTo = require("../middleware/restrictTo");

const { upload } = require("../middleware/multerConfig");
const Router = require("express").Router();

Router.post("/register", register);
Router.post("/login", login);
Router.put("/forgot-password", forgotPassword);
Router.post("/verify-otp", verifyOtp);
Router.put("/reset-password", resetPassword);
Router.get("/users", isAutenticated, restrictTo("admin"), getAllUsers);
Router.delete("/delete/:id", isAutenticated, restrictTo("admin"), deleteUser);
Router.put("/availability/:id", isAutenticated, toggleAvailability);
Router.put("/update-profile/:id", isAutenticated, upload.single('profilePicture'), updateProfile);
Router.put("/change-password/:id", isAutenticated, changePassword);
Router.get("/user/:id", isAutenticated, getUserDetails);

module.exports = Router;