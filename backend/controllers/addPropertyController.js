/*
Run order state -> setstate -> city -> setcity -> zip -> setzip
API property type require token from user
testlogin -> propertytype -> setpropertype -> addproperty
*/

const axios = require('axios');
require('dotenv').config();

const STATE_LINK = "https://apiqa.hometrumpeter.com/location/states";
const CITY_LINK = "https://apiqa.hometrumpeter.com/location/cities/state/";
const ZIP_LINK = "https://apiqa.hometrumpeter.com/location/zipcodes/city/";
const TYPE_LINK = "https://apiqa.hometrumpeter.com/property-management/property-types"
const ADD_PROPERTY_LINK = "https://apiqa.hometrumpeter.com/property-management/property"

//TESTING ONLY
const LOGIN_API = "https://apiqa.hometrumpeter.com/user/login";

//remove once we have authorization implemented, replace with call to property types api endpoint.
const PROPERTY_TYPES = [{
  "createdAt": "2023-09-28 10:17:12",
  "id": "0cdbcd50-f954-11ed-86db-0a580a80022c",
  "isMultiUnit": false,
  "type": "Ranch"
},
{
  "createdAt": "2023-09-28 10:17:12",
  "id": "0cdbde76-f954-11ed-86db-0a580a80022c",
  "isMultiUnit": false,
  "type": "Cottage"
},
{
  "createdAt": "2023-09-28 10:17:12",
  "id": "0cdbf919-f954-11ed-86db-0a580a80022c",
  "isMultiUnit": false,
  "type": "Townhouse"
},
{
  "createdAt": "2023-09-28 10:17:12",
  "id": "0cdc0663-f954-11ed-86db-0a580a80022c",
  "isMultiUnit": false,
  "type": "House"
},
{
  "createdAt": "2023-09-28 10:17:12",
  "id": "0cdc1182-f954-11ed-86db-0a580a80022c",
  "isMultiUnit": false,
  "type": "Bungalow"
},
{
  "createdAt": "2023-09-28 10:17:12",
  "id": "0cdc129c-f954-11ed-86db-0a580a80022c",
  "isMultiUnit": true,
  "type": "Condominium"
},
{
  "createdAt": "2023-09-28 10:17:12",
  "id": "0cdc1347-f954-11ed-86db-0a580a80022c",
  "isMultiUnit": true,
  "type": "Apartment"
}];

const test_acc = {
    "email": "your email",
    "password": "your password",
    "isAdmin": false
};

test_acc_data = {};

exports.testLogin = (req, res) => {
    //console.log(HEADERS);
    //console.log(req.body);
    axios.post(LOGIN_API, test_acc, { 'headers': HEADERS })
    .then(response => {
      // Handle the data from the API response
      test_acc_data = response.data;
      console.log(test_acc_data.data.user);
      res.send(response.data);
    })
    .catch(error => {
      // Handle errors
      console.error('Error fetching data:', error);
      res.send(error);
    });
}

//process.env.API_TOKEN
const HEADERS = {
  'xck': process.env.API_TOKEN,
  'Content-Type': 'application/json', 
};

//"cityId": "",
//"stateId":"",
//"zipcodeId": "",
//"userId": "",
//"propertyTypeId": "",
//"ownerId": "",
stateData = {};
cityData = {};
zipData = {};
typeData = {};
addPropertyJSON = {
    "cityId": "",
    "stateId":"",
    "zipcodeId": "",
    "userId": "",
    "propertyTypeId": "",
    "ownerId": "",
    "parentId": "",
    "name": "",
    "block": "",
    "unit": "",
    "streetAddress": "",
    "phone": "",
    "rent": 0,
    "isPrimary": true,
    "canTenantInitiate": true,
    "registrationFee": 0
};

//get all states
exports.state = (req, res) => {
    console.log(HEADERS);
    //console.log(req.body);
    axios.get(STATE_LINK, { 'headers': HEADERS })
    .then(response => {
      // Handle the data from the API response
        res.send(response.data.data);
    })
    .catch(error => {
      // Handle errors
      console.error('Error fetching data:', error);
      res.send(error);
    });
};

//select state and put in id
exports.setState = (req, res) => {
    //using req.body to set statename
    //GOT IT TO WORK
    //console.log(stateData);
    //console.log(req.body);
    const selectedState = stateData.find(item => item.name === req.body.name)
    addPropertyJSON.stateId = selectedState.id;
    console.log(addPropertyJSON);
}

//all city from selected state
exports.city = (req, res) => {
    console.log(HEADERS);
    requestedStateId = req.query.stateId;
    axios.get(CITY_LINK + requestedStateId,{ 'headers': HEADERS })
    .then(response => {
      // Handle the data from the API response
        const rawData = response.data;
        cityData = rawData.data;
        const refinedData = rawData.data.map(item => ({
            countyId: item.countyId,
            cityId: item.id,
            name: item.name,
        }));
      
        console.log(refinedData);
        //console.log(response.data);
        res.send(refinedData);
    })
    .catch(error => {
      // Handle errors
      console.error('Error fetching data:', error);
      res.send(error);
    });
};

//select city and put in id
exports.setCity = (req, res) => {
    //using req.body to set cityname
    const selectedCity = cityData.find(item => item.name === req.body.name)
    console.log(selectedCity);
    addPropertyJSON.cityId = selectedCity.id;
    addPropertyJSON.countyId = selectedCity.county.id;
    console.log(addPropertyJSON);
}

//all zip of selected city
exports.zip = (req, res) => {
    //console.log(HEADERS);
    axios.get(ZIP_LINK + req.query.cityId,{ 'headers': HEADERS })
    .then(response => {
      // Handle the data from the API response
        const rawData = response.data;
        // console.log('RAW ZIPS');
        // console.log(response.data);
        zipData = rawData.data;
        console.log(zipData)
        const refinedData = rawData.data.map(item => ({
            code: item.code,
            zipId: item.id
        }));
      
        console.log(refinedData);
        //console.log(response.data);
        res.send(refinedData);
    })
    .catch(error => {
      // Handle errors
      console.error('Error fetching data:', error);
      res.send(error);
    });
};

//select zip and set its id
exports.setZip = (req, res) => {
    //using req.body to set cityname
    const selectedZip = zipData.find(item => item.code === req.body.code)
    addPropertyJSON.zipcodeId = selectedZip.id;
    console.log(addPropertyJSON);
}

//get all property type, must have bearer auth to work
//contactHeaders.Authorization = req.body.Authorization;
exports.propertyType = (req, res) => {
    console.log(HEADERS);
    console.log(test_acc_data);
    let contactHeaders = JSON.parse(JSON.stringify(HEADERS));
    contactHeaders.Authorization = "Bearer ";

    console.log(contactHeaders);

    addPropertyJSON.userId = test_acc_data.data.user.id;
    addPropertyJSON.ownerId = test_acc_data.data.user.id;
    addPropertyJSON.phone = test_acc_data.data.user.phone;

    axios.get(TYPE_LINK, { 'headers': contactHeaders })
    .then(response => {
      // Handle the data from the API response
        const rawData = response.data;
        //console.log(response.data);
        typeData = rawData.data;
        //console.log(Data)
        const refinedData = rawData.data.map(item => ({
            type: item.type,
        }));
      
        console.log(refinedData);
        //console.log(response.data);
        res.send(refinedData);
    })
    .catch(error => {
      // Handle errors
      console.error('Error fetching data:', error);
      res.send(error);
    });
};

//select property type and set id
exports.setPropertyType = (req, res) => {
    //using req.body to set cityname
    const selectedType = typeData.find(item => item.type === 'Cottage')
    addPropertyJSON.propertyTypeId = selectedType.id;
    console.log(addPropertyJSON);
}

//add property post, req must have property name, street address and rent
exports.addProperty = (req, res) => {
    //console.log(HEADERS);
    let contactHeaders = JSON.parse(JSON.stringify(HEADERS));
    contactHeaders.Authorization = "Bearer " + test_acc_data.token;

    //console.log(contactHeaders);

    addPropertyJSON.name = "Test01";
    addPropertyJSON.streetAddress = "223 Main street";
    addPropertyJSON.rent = 1500;

    console.log(addPropertyJSON);

    axios.post(ADD_PROPERTY_LINK, addPropertyJSON,{ 'headers': contactHeaders })
    .then(response => {
      // Handle the data from the API response
        const rawData = response.data;
        //console.log(response.data);
        //typeData = rawData.data;
        //console.log(Data)
        //const refinedData = rawData.data.map(item => ({
        //    type: item.type,
        //}));
      
        console.log(response);
        //console.log(response.data);
        res.send(rawData);
    })
    .catch(error => {
      // Handle errors
      console.error('Error fetching data:', error);
      res.send(error);
    });

    exports.getPropertyTypes = (req,res) => {
      const rawData = PROPERTY_TYPES; //REPLACE WITH API CALL
      const refinedData = rawData.map(item => ({
        name: type,
        propertyTypeId: id
      }));
    }
};