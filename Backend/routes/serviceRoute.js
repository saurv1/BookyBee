const { createService, getAllServices, getSingleService, updateService, deleteService, getServicesByCategory, getAdminServices } = require("../controllers/servicecontroller");
const isAuthenticated = require("../middleware/isAutenticated");
const restrictTo = require("../middleware/restrictTo");

const Router = require("express").Router();

Router.post("/postservice", isAuthenticated, restrictTo("serviceprovider"), createService)
Router.get("/getservices", getAllServices)
Router.get("/admin/services", isAuthenticated, restrictTo("admin"), getAdminServices)
Router.get("/getservice/:id", getSingleService)
Router.patch("/updateservice/:id", updateService)
Router.delete("/deleteservice/:id", deleteService)
Router.get("/getservicesbycategory/:category", getServicesByCategory)

module.exports = Router;