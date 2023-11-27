const axios = require('axios');

const LOGIN_API = "https://apiqa.hometrumpeter.com/user/login";
const SIGNUP_API = "https://apiqa.hometrumpeter.com/user/signup";
const SEND_CONTACT_LINK = "https://apiqa.hometrumpeter.com/contact/send";
const CONTACT_VERIFY_LINK = "https://apiqa.hometrumpeter.com/contact/verify"

//process.env.API_TOKEN
const HEADERS = {
  'xck': 'ooksvm4lw79q3y8bmk4g6tk1q7gdw5',
  'Content-Type': 'application/json', 
};

exports.login = (req, res) => {
  console.log(HEADERS);
  console.log(req.body);
  axios.post(LOGIN_API, req.body, { 'headers': HEADERS })
  .then(response => {
    // Handle the data from the API response
    console.log(response.data);
    res.send(response.data);
  })
  .catch(error => {
    // Handle errors
    console.error('Error fetching data:', error);
    res.send(error);
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
    res.send(error);
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
    res.send(error);
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
    res.send(error);
  });
}