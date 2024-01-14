const axios = require('axios');

require('dotenv').config();

const GET_PROPERTY_TENANT_LINK = 'https://apiqa.hometrumpeter.com/property-management/get-property/tenant/';
const BACKGROUND_CHECK_INITIATE_LINK = 'https://apiqa.hometrumpeter.com/background-check/initiate';
const BACKGROUND_CHECK_STATUS_LINK = 'https://apiqa.hometrumpeter.com/background-check/status/';
const BACKGROUND_CHECK_APPROVE_LINK = 'https://apiqa.hometrumpeter.com/background-check/approve';