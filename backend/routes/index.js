const express = require('express');
const controller = require("../controllers/authController");
const controllerProperty = require("../controllers/addPropertyController");

const router = express.Router();

router.post('/login', controller.login);
router.post('/signup', controller.signup);
router.post('/contactsend', controller.contactsend);
router.post('/contactverify', controller.contactverify);
router.get('/state', controllerProperty.state);
router.post('/setstate', controllerProperty.setState);
router.get('/city', controllerProperty.city);
router.post('/setcity', controllerProperty.setCity);
router.get('/zip', controllerProperty.zip);
router.post('/setzip', controllerProperty.setZip);
router.get('/propertytype', controllerProperty.propertyType);
router.post('/setpropertytype', controllerProperty.setPropertyType);
router.get('/test', controllerProperty.testLogin);
router.get('/addproperty', controllerProperty.addProperty);

module.exports = router;