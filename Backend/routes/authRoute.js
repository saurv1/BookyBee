const { register, login, forgotPassword } = require("../controllers/authcontroller");

const Router = require("express").Router();

Router.post("/register", register);
Router.post("/login", login);
Router.put("/forgot-password", forgotPassword);
module.exports = Router;