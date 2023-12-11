const express = require('express');
const controller = require("../controllers/authController");
const dashboardController = require("../controllers/dashboardController");
const controllerProperty = require("../controllers/addPropertyController");
const invitationController = require("../controllers/invitationController.js");

const router = express.Router();

router.post('/login', controller.login);
router.post('/signup', controller.signup);
router.post('/contactsend', controller.contactsend);
router.post('/contactverify', controller.contactverify);
router.get('/state', controllerProperty.state);
router.get('/city', controllerProperty.city);
router.get('/zip', controllerProperty.zip);
router.post('/addproperty', controllerProperty.addProperty);
router.get('/propertytypes', controllerProperty.getPropertyTypes);
router.post('/set-role', controller.setRole)
router.get('/properties', dashboardController.getProperties);
router.post('/inviteuser', invitationController.inviteUser);

module.exports = router;