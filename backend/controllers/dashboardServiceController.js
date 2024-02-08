const axios = require('axios');

require('dotenv').config();

const SERVICE_PROVIDER_LINK = 'https://apiqa.hometrumpeter.com/customer/service-provider/';
const OWNER_LINK = 'https://apiqa.hometrumpeter.com/user/';
const USER_SERVICES_LINK = 'https://apiqa.hometrumpeter.com/service-provider/user/services/';
const SP_SERVICE_REQUESTS = 'https://apiqa.hometrumpeter.com/service-request/sp-services-requests';
const ACTIVE_JOBS_LINK = 'https://apiqa.hometrumpeter.com/job/active-jobs';
const ACTIVATE_JOB_LINK = 'https://apiqa.hometrumpeter.com/service-provider/activejob/';
const COMPLETE_JOB_LINK = 'https://apiqa.hometrumpeter.com/service-provider/completejob/'

const HEADERS = {
    'xck': process.env.API_TOKEN,
    'Content-Type': 'application/json', 
};

exports.getProperties = (req, res) => {
    let getServiceInfoHeaders = HEADERS;
    getServiceInfoHeaders.Authorization = req.headers.authorization;

    //get tenant info from user item in localStorage
    axios.get(SERVICE_PROVIDER_LINK + req.body.id , {'headers': getServiceInfoHeaders})
    .then(response => {
        if (response.data?.isSuccess) {
            //select only some field for display
            const propertyData = response.data.data.property;
            refinedData = {
                name: propertyData.name,
                streetAddress: propertyData.streetAddress,
                owner: propertyData.ownerId
            }

            //get owner first and last name
            axios.get(OWNER_LINK + refinedData.owner , {'headers': getServiceInfoHeaders})
            .then(response => {
                //console.log(response.data);
                if (response.data?.isSuccess) {
                    refinedData.owner = response.data.data.user.firstName + " " + response.data.data.user.lastName;
                    //change to array to use map in display
                    const refinedDataArray = [refinedData];
                    return res.send(refinedDataArray ?? []);
                } else {
                    console.log(response.data.message);
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                res.send({error: error.message});
            })
            //return res.send(response.data.data ?? []);
        } else {
            return res.send({error: response.data.message});
        }
    })
    .catch(error => {
        console.error('Error fetching data:', error);
        res.send({error: error.message});
    })

}

exports.userServices = (req, res) => {
    let userServicesHeaders = HEADERS;
    userServicesHeaders.Authorization = req.headers.authorization;

    axios.get(USER_SERVICES_LINK + req.query.userId, {headers: userServicesHeaders})
    .then(response => {
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

    axios.post(COMPLETE_JOB_LINK + req.query.id, {}, {headers: completeJobHeaders})
    .then(response => {
        res.send(response.data);
    })
    .catch(error => {
        res.status(500).json({error: "Error fetching data"});
        console.error(error);
    })
}
