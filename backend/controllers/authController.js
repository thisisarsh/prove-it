const axios = require('axios');
const jwt = require("jsonwebtoken");

require('dotenv').config();

const LOGIN_API = "https://apiqa.hometrumpeter.com/user/login";
const SIGNUP_API = "https://apiqa.hometrumpeter.com/user/signup";
const SEND_CONTACT_LINK = "https://apiqa.hometrumpeter.com/contact/send";
const CONTACT_VERIFY_LINK = "https://apiqa.hometrumpeter.com/contact/verify"
const SET_ROLE_LINK = "https://apiqa.hometrumpeter.com/user/set-role";
const INVITED_SIGNUP_LINK = "https://apiqa.hometrumpeter.com/user/invited/signup";
const TENANT_SURVEY_LINK = "https://apiqa.hometrumpeter.com/customer/tenant/signup";
const SP_DETAIL_LINK = "https://apiqa.hometrumpeter.com/customer/invited/sp-detail";
const FORGOT_PASSWORD_LINK = "https://apiqa.hometrumpeter.com/user/forgot/password"

//process.env.API_TOKEN
const HEADERS = {
  'xck': process.env.API_TOKEN,
  'Content-Type': 'application/json', 
};

exports.login = (req, res) => {
  // console.log(HEADERS);
  // console.log(req.body);

  axios.post(LOGIN_API, req.body, { 'headers': HEADERS })
  .then(response => {
    // Handle the data from the API response
    //console.log(response.data.isSuccess === true);

    if(!response.data.isSuccess) {
      return res.status(401).send({
        accessToken: null,
        message: response.data.message ?? "Invalid Username or Password"
      });
    }

    let user = response.data.data.user;
    //Need to pass tokens to frontend for phone verify and set role to work.
    user.token = response.data.token;
    user.refreshToken = response.data.refreshToken;
    let role = response.data.rolename;

    res.json({
      user: user,
      role: role,
      token: user.token
    });
  })
  .catch(error => {
    // Handle errors
    console.error('Error fetching data:', error);
    res.send('Error: ' + error.message);
  });
}

exports.signup = (req, res) => {
  console.log(req.body);
  axios.post(SIGNUP_API, req.body, { 'headers': HEADERS })
  .then(response => {
    // Handle the data from the API response
    console.log(response.data);
    res.send(response.data);
  })
  .catch(error => {
    // Handle errors
    console.error('Error fetching data:', error);
    res.send('Error: ' + error.message);
  });
}

exports.contactsend = (req, res) => {
  console.log(req.body);

  let contactHeaders = JSON.parse(JSON.stringify(HEADERS));
  contactHeaders.Authorization = req.body.Authorization;

  axios.post(SEND_CONTACT_LINK, req.body, { 'headers': contactHeaders })
  .then(response => {
    // Handle the data from the API response
    console.log(response.data);
    res.send(response.data);
  })
  .catch(error => {
    // Handle errors
    console.error('Error fetching data:', error);
    res.send('Error: ' + error.message);
  });
}

exports.contactverify = (req, res) => {
  console.log(req.body);

  let contactHeaders = JSON.parse(JSON.stringify(HEADERS));
  contactHeaders.Authorization = req.body.Authorization;

  axios.post(CONTACT_VERIFY_LINK, req.body, { 'headers': contactHeaders })
  .then(response => {
    // Handle the data from the API response
    console.log(response.data);
    res.send(response.data);
  })
  .catch(error => {
    // Handle errors
    console.error('Error fetching data:', error);
    res.send('Error: ' + error.message);
  });
}

exports.setRole = (req, res) => {
  console.log(req.body);

  let setRoleHeaders = JSON.parse(JSON.stringify(HEADERS));
  setRoleHeaders.Authorization = req.body.Authorization;
  let setRoleBody = {roleName: req.body.roleName, refreshToken: req.body.refreshToken}

  axios.post(SET_ROLE_LINK, setRoleBody, { 'headers': setRoleHeaders })
  .then(response => {
    console.log(response.data);
    res.send(response.data);
  })
  .catch(error => {
    console.error('Error fetching data:', error);
    res.send('Error: ' + error.message);
  });
}

exports.invitedSignup = (req, res) => {
  console.log(req.body);

  axios.post(INVITED_SIGNUP_LINK, req.body, {headers: HEADERS})
  .then(response => {
    console.log(response.data);
    res.send(response.data);
  })
  .catch(error => {
    console.error('Error fetching data:', error);
    res.send('Error: ' + error.message);
  })
}

exports.tenantSurvey = (req, res) => {
  console.log(req.body);

  axios.post(TENANT_SURVEY_LINK, req.body, {headers:HEADERS})
  .then(response => {
    console.log(response.data);
    res.send(response.data);
  })
  .catch(error => {
    console.error('Error fetching data:', error);
    res.send('Error: ' + error.message);
  })
}

exports.spDetail = (req, res) => {
  console.log(req.body);

  const SP_DETAIL_BODY = 
  {
    id: req.body.id,
    userId: req.body.userId,
    cityId: req.body.cityId,
    stateId: req.body.stateId,
    countyId: req.body.countyId,
    zipcodeId: req.body.zipcodeId,
    company: req.body.company,
    address: req.body.address,
    distanceCovered: req.body.distanceCovered,
    latitude: req.body.latitude,
    longitude: req.body.longitude,
    perHourRate: req.body.perHourRate
  }

  axios.post(SP_DETAIL_LINK, SP_DETAIL_BODY, {headers:HEADERS})
  .then(response => {
    console.log(response.data);
    res.send(response.data)
  })
  .catch(error => {
    console.error('Error fetching data:', error);
    res.send('Error: ' + error.message);
  })
}

exports.forgotPassword = (req, res) => {
  console.log(req.body);

  axios.post(FORGOT_PASSWORD_LINK, req.body, {headers:HEADERS})
  .then(response => {
    console.log(response.data);
    res.send(response.data);
  })
  .catch(error => {
    console.error('Error fetching data:', error);
    res.send('Error: ' + error.message);  
  })
}
