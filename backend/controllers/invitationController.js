const axios = require('axios');
const nodemailer = require('nodemailer');
require('dotenv').config();

const HT_QA_API = "https://apiqa.hometrumpeter.com";
const INVITE_USER_LINK = HT_QA_API + "/user/invite";

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: 'acs4901group1@gmail.com',
        clientId: '242394255919-is9fofp8s0ik5p6l7n2lihi65e425ons.apps.googleusercontent.com',
        clientSecret: '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',
        refreshToken: '1//04SSYNLhodBNlCgYIARAAGAQSNwF-L9IrVqHhKIwhzSBlpYt9baaSq0_kdPw4nnhvMu2W8jINYA8wDbcqepnl7nRVVpZgAt65d6A',
    }
});

function sendEmail(to, subject, htmlContent) {
    const mailOptions = {
        from: 'acs4901group1@gmail.com',
        to: to,
        subject: subject,
        html: htmlContent,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
}

exports.inviteUser = (req, res) => {
    console.log("--Posting to invite user--");
    console.log(req.body);

    const recipient = req.body.user.email;
    const subject = 'Invitation to Join';
    const htmlContent = `<p>Hello,</p>
               <p>You have been invited to join our HomeTrumpeter.</p>
               <a href="${process.env.FRONT_URL}/signup/invited?email=${req.body.user.email}&role=${req.body.roleName}">Join Now</a>`;

    sendEmail(recipient, subject, htmlContent);

    res.send('Invite sent');

    // axios.post(INVITE_USER_LINK, req.body, {
    //     headers: {
    //         'xck': process.env.API_TOKEN,
    //         'Content-Type': 'application/json',
    //         'Authorization': req.headers.authorization,
    //     }
    // })
    // .then(response => {
    //     console.log(response.data);
    //     res.send(response.data);
    // })
    // .catch(error => {
    //     console.error(error);
    //     res.send(error.message);
    // })
}