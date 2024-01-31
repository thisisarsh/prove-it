const axios = require('axios');

require('dotenv').config();

const OWNED_PROPERTIES_LINK = 'https://apiqa.hometrumpeter.com/property-management/properties/owner';
const GET_PROPERTY_TENANTS = 'https://apiqa.hometrumpeter.com/property-management/tenants/property/';

const HEADERS = {
    'xck': process.env.API_TOKEN,
    'Content-Type': 'application/json',
};

exports.getTenants = async (req, res) => {
    let getPropertiesHeaders = {...HEADERS};
    getPropertiesHeaders.Authorization = req.headers.authorization;

    try {
        let propertiesResponse = await axios.get(OWNED_PROPERTIES_LINK, {'headers': getPropertiesHeaders});
        if (!propertiesResponse.data?.isSuccess) {
            return res.send({error: propertiesResponse.data.message});
        }

        const properties = propertiesResponse.data.data ?? [];
        const tenantRequests = properties.map(property =>
            axios.get(GET_PROPERTY_TENANTS + property.id, {'headers': getPropertiesHeaders})
                .then(response => (
                    { propertyId: property.id, tenants: response.data.data.tenants ?? [] }))
                .catch(error => ({ propertyId: property.id, error: error.message }))
        );

        const tenantsResults = await Promise.all(tenantRequests);
        let tenantsWithProperties = {};

        tenantsResults.forEach(result => {
            if (!result.error) {
                const property = properties.find(p => p.id === result.propertyId);
                if (property) {

                    tenantsWithProperties[property.name] = result.tenants;
                }
            }
        });

        return res.send(tenantsWithProperties);
    } catch (error) {
        console.error('Error fetching properties:', error.message);
        return res.send({error: error.message});
    }
}