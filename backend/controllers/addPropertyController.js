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
const PROPERTY_TYPE_LINK = "https://apiqa.hometrumpeter.com/property-management/property-types"
const ADD_PROPERTY_LINK = "https://apiqa.hometrumpeter.com/property-management/property"

//TESTING ONLY
const LOGIN_API = "https://apiqa.hometrumpeter.com/user/login";

//process.env.API_TOKEN
const HEADERS = {
  'xck': process.env.API_TOKEN,
  'Content-Type': 'application/json', 
};

//get all states
exports.state = (req, res) => {
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

//all city from selected state
exports.city = (req, res) => {
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

//all zip of selected city
exports.zip = (req, res) => {
    axios.get(ZIP_LINK + req.query.cityId,{ 'headers': HEADERS })
    .then(response => {
      // Handle the data from the API response
        const rawData = response.data;
        zipData = rawData.data;
        console.log(zipData)
        const refinedData = rawData.data.map(item => ({
            code: item.code,
            zipId: item.id
        }));
      
        console.log(refinedData);
        res.send(refinedData);
    })
    .catch(error => {
      // Handle errors
      console.error('Error fetching data:', error);
      res.send(error);
    });
};

//add property post
exports.addProperty = (req, res) => {
    //console.log(HEADERS);
    const propertyObject = req.body;
    let addPropertyHeaders = JSON.parse(JSON.stringify(HEADERS));
    addPropertyHeaders.Authorization = req.headers.authorization ?? null;

    console.log(addPropertyHeaders);

    axios.post(ADD_PROPERTY_LINK, propertyObject,{ 'headers': addPropertyHeaders })
    .then(response => {
      // Handle the data from the API response
        const rawData = response.data;
        console.log(response);
        res.send(rawData);
    })
    .catch(error => {
      // Handle errors
      console.error('Error fetching data:', error);
      res.send(error);
    });
};

exports.getPropertyTypes = (req,res) => {
  let propertyTypesHeaders = HEADERS;
  propertyTypesHeaders.Authorization = req.headers.authorization ?? null;

  axios.get(PROPERTY_TYPE_LINK, {'headers': propertyTypesHeaders}).then(response => {
    const rawData = response.data;
    console.log(rawData);
    const refinedData = rawData.data.map(item => ({
      name: item.type,
      propertyTypeId: item.id
    }));
    res.send(refinedData);
  })
};
