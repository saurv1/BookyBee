const { register, login } = require("../controllers/authcontroller");

const Router = require("express").Router();

Router.post("/register", register);
Router.post("/login", login);
module.exports = Router;