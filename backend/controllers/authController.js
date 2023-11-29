const axios = require('axios');
const jwt = require("jsonwebtoken");

const LOGIN_API = "https://apiqa.hometrumpeter.com/user/login";
const SIGNUP_API = "https://apiqa.hometrumpeter.com/user/signup";
const SEND_CONTACT_LINK = "https://apiqa.hometrumpeter.com/contact/send";
const CONTACT_VERIFY_LINK = "https://apiqa.hometrumpeter.com/contact/verify"

const HEADERS = {
  'xck': process.env.API_TOKEN,
  'Content-Type': 'application/json', 
};

const SECRET = 'proveit';

function generateAccessToken(username) {
  return jwt.sign(
    username,
    SECRET,
    { expiresIn: '1800s' }
  );
}

exports.login = (req, res) => {
  console.log(HEADERS);
  console.log(req.body);
  axios.post(LOGIN_API, req.body, { 'headers': HEADERS })
  .then(response => {
    // Handle the data from the API response
    console.log(response.data.isSuccess === true);

    if(!response.data.isSuccess) {
      return res.status(401).send({
        accessToken: null,
        message: "Invalid Password!"
      });
    }

    let user = response.data.data.user;
    let role = response.data.rolename;

    const token = generateAccessToken({ username: response.data.username });
    console.log(response.data.data.user);
    res.json({
      user: user,
      role: role,
      token: token
    });
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
