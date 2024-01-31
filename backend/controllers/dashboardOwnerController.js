const axios = require('axios');

require('dotenv').config();

const OWNED_PROPERTIES_LINK = 'https://apiqa.hometrumpeter.com/property-management/properties/owner';
const DELETE_PROPERTY_LINK = 'https://apiqa.hometrumpeter.com/property-management/property/';
const GET_PROPERTY_DETAIL_LINK = 'https://apiqa.hometrumpeter.com/property-management/property/';
const FIND_SERVICE_PROVIDER = 'https://apiqa.hometrumpeter.com/service-provider/sp';

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
            //console.log(response.data.data ?? []);
            //console.log("PROPERTY");
            return res.send(response.data.data ?? []);
        } else {
            return res.send({error: response.data.message});
        }
    })
    .catch(error => {
        console.error('Error fetching data:', error);
        res.send({error: error.message});
    });
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
    });
}

exports.getPropertyDetails = (req, res) => {
    let getPropertiesHeaders = HEADERS;
    getPropertiesHeaders.Authorization = req.headers.authorization;
    //console.log(req.body);
    //console.log(req.body.stateId);

    axios.get(GET_PROPERTY_DETAIL_LINK + req.body.id, {'headers': HEADERS})
    .then(response => {
        if (response.data?.isSuccess) {
            //console.log("RESPONSE");
            //console.log(response.data.data);
            const propertyData = response.data.data;
            refinedData = {
                name: propertyData.name,
                cityName: propertyData.city.name,
                countyName: propertyData.county.name,
                stateName: propertyData.state.name,
                propertyType: propertyData.propertyType.type,
                isDeletable: propertyData.isDeletable,
                isPrimary: propertyData.isPrimary.toString(),
                isTenantActive: propertyData.isTenantActive.toString(),
                streetAddress: propertyData.streetAddress,
                zipcode: propertyData.zipcode.code,
                rent: propertyData.rent,
                isSuccess: true
            }
            //const refinedDataArray = [refinedData];
            //return res.send(refinedDataArray ?? []);
            return res.send(refinedData ?? {});

        } else {
            return res.send({error: response.data.message});
        }
    })
    .catch(error => {
        console.error('Error fetching data:', error);
        res.send({error: error.message});
    });
}

exports.findServiceProvider = (req, res) => {
    let findServiceProviderHeaders = HEADERS;
    findServiceProviderHeaders.Authorization = req.headers.authorization;

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


    axios.post(FIND_SERVICE_PROVIDER, findServiceProviderObject, {'headers': getPropertiesHeaders})
    .then(response => {
        if (response.data?.isSuccess) {
            console.log(response.data.data ?? []);
            return res.send(response.data.data ?? []);
        } else {
            return res.send({error: response.data.message});
        }
    })
    .catch(error => {
        console.error('Error fetching data:', error);
        res.send({error: error.message});
    });
}
