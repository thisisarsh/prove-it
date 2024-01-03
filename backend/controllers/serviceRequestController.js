const axios = require('axios');
require('dotenv').config();

const GENERAL_SERVICE_TYPES_LINK = "https://apiqa.hometrumpeter.com/service-provider/service-type/domain";
const SPECIFIC_SERVICE_TYPES_LINK = "https://apiqa.hometrumpeter.com/service-provider/service-type/options/";
const TENANT_PROPERTY_LINK = "https://apiqa.hometrumpeter.com/property-management/get-property/tenant/";
const REQUEST_TIMELINES_LINK = "https://apiqa.hometrumpeter.com/service-provider/timelines"

const HEADERS = {
    'xck': process.env.API_TOKEN,
    'Content-Type': 'application/json', 
};

exports.generalServiceTypes = (req, res) => {
    console.log(req.body);
    let genServiceTypeHeaders = HEADERS;
    genServiceTypeHeaders.Authorization = req.headers.authorization;

    axios.get(GENERAL_SERVICE_TYPES_LINK, {headers: genServiceTypeHeaders})
    .then(response => {
        //console.log(response.data);
        res.send(response.data);
    })
    .catch(error => {
        console.error(error);
        res.status(500).json({error: error.message})
    })
}

exports.specificServiceTypes = (req, res) => {
    console.log("Getting specific services for parent type", req.query.parentId)

    if (!req.query.parentId) {
        req.status(400).json({error: "Please specify the parentId to get unique service types"});
    }

    let specServiceTypeHeaders = HEADERS;
    specServiceTypeHeaders.Authorization = req.headers.authorization;

    axios.get(SPECIFIC_SERVICE_TYPES_LINK + req.query.parentId, {headers: HEADERS})
    .then(response => {
        //console.log(response.data);
        res.send(response.data);
    })
    .catch(error => {
        console.error(error);
        res.status(500).json({error: error.message});
    })
}

exports.tenantProperty = (req, res) => {
    console.log("Getting tenant property for tenantId", req.query.tenantId);

    if (!req.query.tenantId) {
        res.status(400).json({error: "Please specify the tenantId to get tenant property"});
    }

    let tenantPropertyHeaders = HEADERS;
    tenantPropertyHeaders.Authorization = req.headers.authorization;

    axios.get(TENANT_PROPERTY_LINK + req.query.tenantId, {headers: HEADERS})
    .then(response => {
        //console.log(response.data);
        res.send(response.data);
    })
    .catch(error => {
        console.error(error);
        res.status(500).json({error: error.message});
    })
}

exports.requestTimelines = (req, res) => {
    console.log("Getting request timelines...");

    let requestTimelineHeaders = HEADERS;
    requestTimelineHeaders.Authorization = req.headers.authorization;

    axios.get(REQUEST_TIMELINES_LINK, {headers: requestTimelineHeaders})
    .then(response => {
        res.send(response.data);
    })
    .catch(error => {
        console.error(error);
        res.status(500).json({error: error.message});
    })
}