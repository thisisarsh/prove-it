const express = require('express');
const controller = require("../controllers/authController");
const dashboardOwnerController = require("../controllers/dashboardOwnerController");
const dashboardTenantController = require("../controllers/dashboardTenantController")
const controllerProperty = require("../controllers/addPropertyController");
const invitationController = require("../controllers/invitationController.js");
//const ownerPropertyController = require("../controllers/ownerPropertyController.js");
const ownerTenantsController = require("../controllers/ownerTenantsController");
const backgroundCheckController = require("../controllers/backgroundCheckController");
const agreementController = require("../controllers/agreementController");
const serviceRequestController = require("../controllers/serviceRequestController.js");
const dashboardServiceController = require("../controllers/dashboardServiceController.js");
const ownerServiceProviderController = require("../controllers/ownerServiceProviderController.js");

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
router.get('/properties-owner', dashboardOwnerController.getProperties);
router.post('/get-property-details', dashboardOwnerController.getPropertyDetails);
router.post('/find-sp', serviceRequestController.getPrivateProviders);
router.post('/properties-tenant', dashboardTenantController.getProperties);
//router.post('/properties-service', dashboardServiceController.getProperties);
router.get('/properties-tenant', dashboardTenantController.getProperties)
router.delete('/deleteproperty', dashboardOwnerController.deleteProperties);
// router.post('/inviteuser', invitationController.inviteUser);
router.post('/signup/invited', controller.invitedSignup);
router.post('/survey/tenant', controller.tenantSurvey);

router.post('/send-invite', invitationController.inviteUser);
router.post('/invited/sp-detail', controller.spDetail);
router.post('/address/validate', controllerProperty.validateAddress);
router.post('/forgotpassword', controller.forgotPassword);

router.get('/owner-tenants', ownerTenantsController.getTenants)
router.post('/tenant-detail', ownerTenantsController.getTenantInProperty);
router.get('/owner-service-provider', ownerServiceProviderController.getServiceProvider)

router.post('/background-check/tenant', backgroundCheckController.checkTenant)
router.post('/background-check/tenant/approve', backgroundCheckController.approveTenant)

router.post('/agreement/initiate', agreementController.sendAgreement)
router.post('/agreement/submit', agreementController.submitAgreement)
router.post('/agreement/approve', agreementController.approveAgreement)
router.get('/general-service-types', serviceRequestController.generalServiceTypes);
router.get('/specific-service-types', serviceRequestController.specificServiceTypes);
router.get('/request-timelines', serviceRequestController.requestTimelines);
router.post('/ticket/initiated', serviceRequestController.tenantTicket);
router.get('/ticket/tenant/tickets', serviceRequestController.getTenantTicket);
router.get('/ticket/manager/tickets', serviceRequestController.getManagerTicket);
router.post('/service', serviceRequestController.addService);
router.get('/user-services', dashboardServiceController.userServices);

router.post('/private-providers', serviceRequestController.getPrivateProviders);
router.get('/request-details', serviceRequestController.getRequestDetails);
router.post('/service-request/ticket', serviceRequestController.serviceRequestTicket);
router.get('/approve-proposal', serviceRequestController.approveProposal);  

module.exports = router;
