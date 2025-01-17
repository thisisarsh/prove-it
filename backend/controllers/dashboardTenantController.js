const axios = require('axios');

require('dotenv').config();

const TENANT_LINK = 'https://apiqa.hometrumpeter.com/property-management/get-property/tenant/';
const OWNER_LINK = 'https://apiqa.hometrumpeter.com/user/';
const TENANT_REQUESTS_LINK = 'https://apiqa.hometrumpeter.com/service-request/tenant/service-requests';


const HEADERS = {
    'xck': process.env.API_TOKEN,
    'Content-Type': 'application/json', 
};

exports.getProperties = (req, res) => {
    let getTenantInfoHeaders = HEADERS;
    getTenantInfoHeaders.Authorization = req.headers.authorization;

    //get tenant info from user item in localStorage
    axios.get(TENANT_LINK + req.query.tenantId , {'headers': getTenantInfoHeaders})
    .then(response => {
        if (response.data?.isSuccess) {
            //select only some field for display
            console.log("TENANT PROPERTY RESPONSE:");
            console.log(response.data.data);
            const propertyData = response.data.data.property;
            refinedData = {
                name: propertyData.name,
                streetAddress: propertyData.streetAddress,
                owner: propertyData.ownerId,
                id: propertyData.id
            };

            //get owner first and last name
            axios.get(OWNER_LINK + refinedData.owner , {'headers': getTenantInfoHeaders})
            .then(response => {
                //console.log(response.data);
                if (response.data?.isSuccess) {
                    console.log("TENANT DETAIL OF HOMEOWNER RESPONSE:");
                    console.log(response.data.data);
                    refinedData.owner = response.data.data.user.firstName + " " + response.data.data.user.lastName;
                    refinedData.ownerContact = {
                        name: response.data.data.user.firstName = " " + response.data.data.user.lastName,
                        phone: response.data.data.user.phone,
                        email: response.data.data.user.email,
                    }
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

exports.getTenantRequests = (req, res) => {
    let tenantRequestHeaders = HEADERS;
    tenantRequestHeaders.Authorization = req.headers.authorization;

    axios.get(TENANT_REQUESTS_LINK, {headers: tenantRequestHeaders})
    .then(response => {
        console.log('TENANT SERVICE REQUESTS:');
        console.log(response.data);
        res.send(response.data);
    })
    .catch(error => {
        console.error(error);
        res.status(500).json({error: error.message});
    })
}

