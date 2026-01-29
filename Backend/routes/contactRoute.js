const { submitContactForm } = require("../controllers/contactcontroller");
const Router = require("express").Router();

Router.post("/", submitContactForm);

module.exports = Router;
