const axios = require('axios');

require('dotenv').config();

const SERVICE_PROVIDER_LINK = 'https://apiqa.hometrumpeter.com/customer/service-provider/';
const OWNER_LINK = 'https://apiqa.hometrumpeter.com/user/';
const USER_SERVICES_LINK = 'https://apiqa.hometrumpeter.com/service-provider/user/services/';
const SP_SERVICE_REQUESTS = 'https://apiqa.hometrumpeter.com/service-request/sp-services-requests';
const ACTIVE_JOBS_LINK = 'https://apiqa.hometrumpeter.com/job/active-jobs';
const COMPLETED_JOBS_LINK = 'https://apiqa.hometrumpeter.com/job/completed-jobs';
const ACTIVATE_JOB_LINK = 'https://apiqa.hometrumpeter.com/service-provider/activejob/';
const COMPLETE_JOB_LINK = 'https://apiqa.hometrumpeter.com/service-provider/completejob/'

const HEADERS = {
    'xck': process.env.API_TOKEN,
    'Content-Type': 'application/json', 
};

exports.userServices = (req, res) => {
    let userServicesHeaders = HEADERS;
    userServicesHeaders.Authorization = req.headers.authorization;

    axios.get(USER_SERVICES_LINK + req.query.userId, {headers: userServicesHeaders})
    .then(response => {
        console.log("SERVICE PROVIDER USER RESPONSE:");
        console.log(response.data);
        res.send(response.data);
    })
    .catch(error => {
        res.status(500).json({error: "Error fetching data"})
        console.error(error);
    });
}

exports.getRequests = (req, res) => {
    let userServicesHeaders = HEADERS;
    userServicesHeaders.Authorization = req.headers.authorization;

    axios.get(SP_SERVICE_REQUESTS, {headers: userServicesHeaders})
    .then(response => {
        console.log("SERVICE PROVIDER REQUEST RESPONSE:");
        console.log(response.data.data);
        res.send(response.data);
    })
    .catch(error => {
        res.status(500).json({error: "Error fetching data"})
        console.error(error);
    });
}

exports.activeJobs = (req, res) => {
    let getJobsHeaders = HEADERS;
    getJobsHeaders.Authorization = req.headers.authorization;

    axios.get(ACTIVE_JOBS_LINK, {headers: getJobsHeaders})
    .then(response => {
        console.log("SERVICE PROVIDER ACTIVE JOBS:")
        res.send(response.data);
    })
    .catch(error => {
        res.status(500).json({error: "Error fetcing data"});
        console.error(error);
    })
}

exports.completedJobs = (req, res) => {
    let getJobsHeaders = HEADERS;
    getJobsHeaders.Authorization = req.headers.authorization;

    axios.get(COMPLETED_JOBS_LINK, {headers: getJobsHeaders})
    .then(response => {
        console.log("SERVICE PROVIDER COMPLETED JOB:");
        console.log(response.data);
        res.send(response.data);
    })
    .catch(error => {
      res.status(500).json({error: "Error fetcing data"});
      console.error(error);
    })
}

exports.activateJob = (req, res) => {
    let activateJobHeaders = HEADERS;
    activateJobHeaders.Authorization = req.headers.authorization;

    axios.post(ACTIVATE_JOB_LINK + req.query.id, {}, {headers: activateJobHeaders})
    .then(response => {
        console.log("SERVICE PROVIDER ACTIVATE JOB RESPONSE:");
        console.log(response.data);
        res.send(response.data);
    })
    .catch(error => {
        res.status(500).json({error: "Error fetching data"});
        console.error(error);
    })
}

exports.completeJob = (req, res) => {
    let completeJobHeaders = HEADERS;
    completeJobHeaders.Authorization = req.headers.authorization;

    //TODO: Implement this with a modal on the frontend
    axios.post(COMPLETE_JOB_LINK + req.query.id, {amount:1, serviceHours:1}, {headers: completeJobHeaders})
    .then(response => {
        console.log("SERVICE PROVIDER COMPLETE JOB RESPONSE:");
        console.log(response.data);
        res.send(response.data);
    })
    .catch(error => {
        res.status(500).json({error: "Error fetching data"});
        console.error(error);
    })
}
