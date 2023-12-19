const axios = require('axios');

require('dotenv').config();

const TENANT_LINK = 'https://apiqa.hometrumpeter.com/customer/tenant/';
const OWNER_LINK = 'https://apiqa.hometrumpeter.com/user/';

const HEADERS = {
    'xck': process.env.API_TOKEN,
    'Content-Type': 'application/json', 
};

exports.getProperties = (req, res) => {
    let getTenantInfoHeaders = HEADERS;
    getTenantInfoHeaders.Authorization = req.headers.authorization;

    //get tenant info from user item in localStorage
    axios.get(TENANT_LINK + req.body.id , {'headers': getTenantInfoHeaders})
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
            axios.get(OWNER_LINK + refinedData.owner , {'headers': getTenantInfoHeaders})
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
