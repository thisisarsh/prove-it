const express = require('express');
const controller = require("../controllers/authController");
const dashboardController = require("../controllers/dashboardController");

const router = express.Router();

router.post('/login', controller.login);
router.post('/signup', controller.signup);
router.post('/contactsend', controller.contactsend);
router.post('/contactverify', controller.contactverify);
router.post('/set-role', controller.setRole)
router.get('/properties', dashboardController.getProperties);

module.exports = router;