const axios = require('axios');

require('dotenv').config();

const OWNED_PROPERTIES_LINK = 'https://apiqa.hometrumpeter.com/property-management/properties/owner';
const DELETE_PROPERTY_LINK = 'https://apiqa.hometrumpeter.com/property-management/property/';

const HEADERS = {
    'xck': process.env.API_TOKEN,
    'Content-Type': 'application/json', 
};

exports.getProperties = (req, res) => {
    let getPropertiesHeaders = HEADERS;
    getPropertiesHeaders.Authorization = req.headers.authorization;

    axios.get(OWNED_PROPERTIES_LINK, {'headers': getPropertiesHeaders})
    .then(response => {
        if (response.data?.isSuccess) {
            return res.send(response.data.data ?? []);
        } else {
            return res.send({error: response.data.message});
        }
    })
    .catch(error => {
        console.error('Error fetching data:', error);
        res.send({error: error.message});
    })

}

exports.deleteProperties = (req, res) => {
    let getPropertiesHeaders = HEADERS;
    getPropertiesHeaders.Authorization = req.headers.authorization;
    console.log(req.body);        
    axios.delete(DELETE_PROPERTY_LINK + req.body.id, {'headers': getPropertiesHeaders})
    .then(response => {
        res.send(response.data);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
        res.send({error: error.message});
    })

}