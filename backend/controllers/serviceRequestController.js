const axios = require('axios');
require('dotenv').config();

const GENERAL_SERVICE_TYPES_LINK = "https://apiqa.hometrumpeter.com/service-provider/service-type/domain";
const SPECIFIC_SERVICE_TYPES_LINK = "https://apiqa.hometrumpeter.com/service-provider/service-type/options/";
const TENANT_PROPERTY_LINK = "https://apiqa.hometrumpeter.com/property-management/get-property/tenant/";
const REQUEST_TIMELINES_LINK = "https://apiqa.hometrumpeter.com/service-provider/timelines";
const INITIATED_TICKET_LINK = "https://apiqa.hometrumpeter.com/ticket/initiated";
const GET_TENANT_TICKET_LINK = "https://apiqa.hometrumpeter.com/ticket/tenant/tickets";
const GET_MANAGER_TICKET_LINK = "https://apiqa.hometrumpeter.com/service-request/initiator/service-requests";
const ADD_SERVICE_LINK = "https://apiqa.hometrumpeter.com/service-provider/service";
const FIND_SERVICE_PROVIDER_LINK =  "https://apiqa.hometrumpeter.com/service-provider/sp";
const REQUEST_DETAILS_LINK = "https://apiqa.hometrumpeter.com/service-provider/services-request-detail/"
const SERVICE_REQUEST_TICKET_LINK = "https://apiqa.hometrumpeter.com/ticket/services-request";
const SEND_PROPOSAL_LINK = "https://apiqa.hometrumpeter.com/service-provider/send-proposal/";
const APPROVE_PROPOSAL_LINK = "https://apiqa.hometrumpeter.com/service-provider/approve-proposal/";
const REJECT_PROPOSAL_LINK = "https://apiqa.hometrumpeter.com/service-provider/reject-proposal/";
const MANAGER_REJECT_REQUEST_LINK = "https://apiqa.hometrumpeter.com/service-provider/reject-service/";

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

exports.tenantTicket = (req, res) => {
    console.log("Processing tenant ticket...");

    let tenantTicketHeaders = HEADERS;
    tenantTicketHeaders.Authorization = req.headers.authorization;

    axios.post(INITIATED_TICKET_LINK, req.body, {headers: tenantTicketHeaders})
    .then(response => {
        res.send(response.data);
    })
    .catch(error => {
        console.error(error);
        res.status(500).json({error: error.message});
    })
}

exports.getTenantTicket = (req, res) => {
    console.log("Getting tenant tickets...");

    let Headers = HEADERS;
    Headers.Authorization = req.headers.authorization;

    axios.get(GET_TENANT_TICKET_LINK, {headers: Headers})
    .then(response => {
        res.send(response.data.data);
    })
    .catch(error => {
        console.error(error);
        res.status(500).json({error: error.message});
    })
}

exports.addService = (req, res) => {
    console.log("Posting new services...");

    let addServiceHeaders = HEADERS;
    addServiceHeaders.Authorization = req.headers.authorization;

    axios.post(ADD_SERVICE_LINK, req.body, {headers: addServiceHeaders})
    .then(response => {
        res.send(response.data);
    })
    .catch(error => {
        console.error(error);
        res.status(500).json({error: error.message});
    })
}

exports.getManagerTicket = (req, res) => {
    console.log("Getting manager tickets...");

    let Headers = HEADERS;
    Headers.Authorization = req.headers.authorization;
    
    axios.get(GET_MANAGER_TICKET_LINK, {headers: Headers})
    .then(response => {
        service_requests = response.data.data.serviceRequests;
        res.send(service_requests);
    })
    .catch(error => {
        console.error(error);
        res.status(500).json({error: error.message});
    })
}

exports.getPrivateProviders = (req, res) => {
    console.log("Getting private providers...");

    let headers = HEADERS;
    headers.Authorization = req.headers.authorization;
    //console.log(req.body.childId);
    //console.log(req.body.propertyId);

    let findServiceProviderObject =
        {
            "typeId": req.body.childId,
            "propertyId": req.body.propertyId,
            "serviceProviderType":"0",
            "cities":[],
            "city":"",
            "showMiles":false,
            "showTime":false,
            "showBounded":false,
            "showLicensed":false,
            "skipedLicensed":true,
            "showInsured":false,
            "showVerified":false
        };

    axios.post(FIND_SERVICE_PROVIDER_LINK, findServiceProviderObject, {headers: headers})
    .then(response => {
        if (response.data.isSuccess) {
            let refinedData = [];
            //console.log(response.data.data);
            //extract the service provider information from the reponse objects
            for (let i=0; i<response.data.data.length; i++) {
                refinedData.push(response.data.data[i].serviceProvider);
            }

            console.log(refinedData);
            res.send({isSuccess: true, data: refinedData});
        } else {
            res.send(response.data);
        }
    })
    .catch(error => {
        console.error(error);
        res.status(500).json({error: error.message});
    })
}

exports.getRequestDetails = (req, res) => {
    console.log("Getting request details for service request " + req.query.id);

    let requestDetailHeaders = HEADERS;
    requestDetailHeaders.Authorization = req.headers.authorization;

    axios.get(REQUEST_DETAILS_LINK + req.query.id, {headers: requestDetailHeaders})
    .then(response => {
        res.send(response.data)
    })
    .catch(error => {
        console.error(error);
        res.status(500).json({error: error.message});
    })
}

exports.serviceRequestTicket = (req, res) => {
    console.log("Posting the following ticket as a service request: ", req.body);

    let serviceRequestTicketHeaders = HEADERS;
    serviceRequestTicketHeaders.Authorization = req.headers.authorization;

    axios.post(SERVICE_REQUEST_TICKET_LINK, req.body, {headers: serviceRequestTicketHeaders})
    .then(response => {
        res.send(response.data);
    })
    .catch(error => {
        console.error(error);
        res.status(500).json({error: error.message});
    })
}

exports.sendProposal = (req, res) => {
  console.log("Sending proposal from service provider");

  let sendProposalHeaders = HEADERS;
  sendProposalHeaders.Authorization = req.headers.authorization;

  axios.post(SEND_PROPOSAL_LINK, req.body, {headers: sendProposalHeaders})
  .then(response => {
      res.send(response.data);
  })
  .catch(error => {
      console.error(error);
      res.status(500).json({error: error.message});
  })
}

exports.approveProposal = (req, res) => {
    console.log("Approving proposal with id " + req.query.id);

    let approveProposalHeaders = HEADERS;
    approveProposalHeaders.Authorization = req.headers.authorization;

    axios.get(APPROVE_PROPOSAL_LINK + req.query.id, {headers: approveProposalHeaders})
    .then(response => {
        res.send(response.data);
    })
    .catch(error => {
        console.error(error);
        res.status(500).json({error: error.message});
    })
}

exports.rejectProposal = (req, res) => {
  console.log("Rejecting proposal for " + req.query.id);

  let rejectProposalHeaders = HEADERS;
  rejectProposalHeaders.Authorization = req.headers.authorization;

  axios.delete(REJECT_PROPOSAL_LINK + req.query.id, {headers: rejectProposalHeaders})
  .then(response => {
      res.send(response.data)
  })
  .catch(error => {
      console.error(error);
      res.status(500).json({error: error.message});
  })
}

exports.managerRejectRequest = (req, res) => {
  console.log("Rejecting service request for " + req.query.reqId);

  let managerRejectRequestHeaders = HEADERS;
  managerRejectRequestHeaders.Authorization = req.headers.authorization;

  axios.delete(MANAGER_REJECT_REQUEST_LINK + req.query.reqId, {headers: managerRejectRequestHeaders})
  .then(response => {
      res.send(response.data)
  })
  .catch(error => {
      console.error(error);
      res.status(500).json({error: error.message});
  })
}