const axios = require('axios');

require('dotenv').config();

const GET_PROPERTY_TENANT_LINK = 'https://apiqa.hometrumpeter.com/property-management/get-property/tenant/';
const BACKGROUND_CHECK_INITIATE_LINK = 'https://apiqa.hometrumpeter.com/background-check/initiate';
const BACKGROUND_CHECK_STATUS_LINK = 'https://apiqa.hometrumpeter.com/background-check/status/';
const BACKGROUND_CHECK_APPROVE_LINK = 'https://apiqa.hometrumpeter.com/background-check/approve';

const HEADERS = {
    'xck': process.env.API_TOKEN,
    'Content-Type': 'application/json',
};

exports.checkTenant = (req, res) => {

    let payload = {
        userId: req.query.userId,
        firstName: req.query.firstName,
        lastName: req.query.lastName,
        Email: req.query.email,
        tenantPropertyRefId: "",

        // WIP : Add as requested
        packages: {
            request_equifax: true,
            request_enhanced_identity_verification: true
        }
    };

    let checkHeaders = {...HEADERS}
    checkHeaders.Authorization = req.headers.authorization

    axios.get(GET_PROPERTY_TENANT_LINK + req.query.userId, {'headers': checkHeaders})
        .then(response => {
            if (response.data?.isSuccess) {

                const tenantDetails = response.data.data;

                payload.tenantPropertyRefId = tenantDetails.tenantPropertyRefId;

                return axios.post(BACKGROUND_CHECK_INITIATE_LINK, payload, { 'headers': checkHeaders })
                    .then(bgCheckResponse => {
                        if (bgCheckResponse.data?.isSuccess) {
                            res.send({
                                isSuccess: bgCheckResponse.data.isSuccess,
                                message: bgCheckResponse.data.message
                            });
                        } else {
                            res.status(400).send({ error: bgCheckResponse.data.message });
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        res.status(500).send({ error: error.message || 'Internal server error' });
                    });

            } else {
                return res.send({error: response.data.message});
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            res.send({error: error.message});
        }
    );
}

exports.approveTenant = (req, res) => {

    // WIP : Need to fix comments

    let payload = {
        applicantId: "",
        comments: "Good",
        userId: req.query.userId,
        tenantPropertyRefId: ""
    };

    let checkHeaders = {...HEADERS, Authorization: req.headers.authorization};

    // Need to get applicant id first
    // If doesn't work try setting downloadURL to false

    axios.get(GET_PROPERTY_TENANT_LINK + req.query.userId, { headers: checkHeaders })
        .then(response => {

            if (!response.data?.isSuccess) {
                throw new Error(response.data.message);
            }

            payload.tenantPropertyRefId = response.data.data.tenantPropertyRefId;

            return axios.get(BACKGROUND_CHECK_STATUS_LINK + req.query.userId, { headers: checkHeaders });
        })
        .then(statusResponse => {

            if (!statusResponse.data.isSuccess) {
                throw new Error(statusResponse.data.message);
            }

            payload.applicantId = statusResponse.data.data.status.applicantId;

            return axios.post(BACKGROUND_CHECK_APPROVE_LINK, payload, { headers: checkHeaders });
        })
        .then(approveResponse => {

            if (!approveResponse.data.isSuccess) {
                throw new Error(approveResponse.data.message);
            }

            res.send({ message: "Tenant approved successfully" });
        })
        .catch(error => {
            console.error('Error:', error);
            res.status(500).send({ error: error.message || 'Internal server error' });
        });
};