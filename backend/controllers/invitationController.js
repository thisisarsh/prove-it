const axios = require('axios');
require('dotenv').config();

const HT_QA_API = "https://apiqa.hometrumpeter.com";
const INVITE_USER_LINK = HT_QA_API + "/user/invite";

exports.inviteUser = (req, res) => {
    console.log("--Posting to invite user--");
    console.log(req.body);
    axios.post(INVITE_USER_LINK, req.body, {
        headers: {
            'xck': process.env.API_TOKEN,
            'Content-Type': 'application/json',
            'Authorization': req.headers.authorization,
        }
    })
    .then(response => {
        console.log(response.data);
        res.send(response.data);
    })
    .catch(error => {
        console.error(error);
        res.send(error.message);
    })
}