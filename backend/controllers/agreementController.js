const axios = require('axios');

require('dotenv').config();

const GET_PROPERTY_TENANT_LINK = 'https://apiqa.hometrumpeter.com/property-management/get-property/tenant/';
const AGREEMENT_INITIATE_LINK = 'https://apiqa.hometrumpeter.com/agreement/initiate';
const AGREEMENT_SUBMIT_LINK = 'https://apiqa.hometrumpeter.com/agreement/submit';
const AGREEMENT_VIEW_LINK = 'https://apiqa.hometrumpeter.com/agreement/tenant/{tenantId}/property/{propertyId}';
const AGREEMENT_APPROVE_LINK = 'https://apiqa.hometrumpeter.com/agreement/approved';

const HEADERS = {
    'xck': process.env.API_TOKEN,
    'Content-Type': 'application/json',
};

exports.sendAgreement = (req, res) => {
    let payload = {
        tenantId: req.query.userId,
        tenantPropertyRefId: ""
    };

    let headers = {...HEADERS, Authorization: req.headers.authorization};

    axios.get(GET_PROPERTY_TENANT_LINK + req.query.userId, { 'headers': headers })
        .then(response => {
            if (!response.data?.isSuccess) {
                throw new Error(response.data.message);
            }
            payload.tenantPropertyRefId = response.data.data.tenantPropertyRefId;

            return axios.post(AGREEMENT_INITIATE_LINK, payload, { 'headers': headers });
        })
        .then(agResponse => {
            if (!agResponse.data?.isSuccess) {
                throw new Error(agResponse.data.message);
            }
            res.send({ message: "Agreement sent successfully" });
        })
        .catch(error => {
            console.error('Error:', error);
            res.status(500).send({ error: error.message || 'Internal server error' });
        });
};

exports.submitAgreement = (req, res) => {

    // WIP : Build payload more dynamically by receiving values from client

    let payload = {
        tenantId: req.query.userId,
        ownerId: "",
        managerId: "",
        propertyId: "",
        rent: 120,
        integrationFee: 0,
        htFee: 0,
        managerFee: 0,
        advancePayment: 100,
        rentDueDate: 0,
        isDepositPayable: true,
        isRentPayable: true,
        isCustomDueDate: true,
        isRecurringPayment: true,
        startDate: "2024-01-14T15:08:04.626Z",
        endDate: "2024-01-14T15:08:04.626Z",
        securityDepositStatus: 0,
        lateFee: 0,
        tenantPropertyRefId: ""
    }

    let headers = {...HEADERS, Authorization: req.headers.authorization};

    axios.get(GET_PROPERTY_TENANT_LINK + req.query.userId, { 'headers': headers })
        .then(response => {
            if (!response.data?.isSuccess) {
                throw new Error(response.data.message);
            }
            payload.ownerId = response.data.property.ownerId;
            payload.managerId = response.data.property.ownerId;
            payload.propertyId = response.data.property.id;
            payload.tenantPropertyRefId = response.data.data.tenantPropertyRefId;

            return axios.post(AGREEMENT_SUBMIT_LINK, payload, { 'headers': headers });
        })
        .then(agResponse => {
            if (!agResponse.data?.isSuccess) {
                throw new Error(agResponse.data.message);
            }
            res.send({ message: "Agreement submitted successfully" });
        })
        .catch(error => {
            console.error('Error:', error);
            res.status(500).send({ error: error.message || 'Internal server error' });
        });
}

exports.approveAgreement = (req, res) => {
    let payload = {
        id: "",
        tenantId: req.query.userId,
        propertyId: ""
    };

    let headers = {...HEADERS, Authorization: req.headers.authorization};

    axios.get(GET_PROPERTY_TENANT_LINK + req.query.userId, { 'headers': headers })
        .then(response => {
            if (!response.data?.isSuccess) {
                throw new Error(response.data.message);
            }

            payload.propertyId = response.data.property.id;

            return axios.get(AGREEMENT_VIEW_LINK.replace('{tenantId}', req.query.userId).replace('{propertyId}', payload.propertyId), { 'headers': headers });
        })
        .then(agResponse => {
            if (!agResponse.data?.isSuccess) {
                throw new Error(agResponse.data.message);
            }

            payload.id = agResponse.data.data.agreement.id;

            return axios.post(AGREEMENT_APPROVE_LINK, payload, { 'headers': headers });
        })
        .then(finalResponse => {
            if (!finalResponse.data?.isSuccess) {
                throw new Error(finalResponse.data.message);
            }
            res.send({ message: "Agreement approved successfully" });
        })
        .catch(error => {
            console.error('Error:', error);
            res.status(500).send({ error: error.message || 'Internal server error' });
        });
};