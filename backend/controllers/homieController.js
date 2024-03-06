const axios = require('axios');

const HOMIE_CHAT_API = 'http://ht-bot-server-dev-feature-homie:5005/webhooks/rest/webhook';

const HEADERS = {
    'Content-Type': 'application/json',
};

exports.sendMessage = async (req, res) => {
    try {
        console.log("Request to Rasa:", req.body);
        const response = await axios.post(HOMIE_CHAT_API, req.body, { headers: HEADERS });
        res.status(200).json(response.data);
    } catch (error) {
        console.error("Error sending message to Rasa:", error.message);
        res.status(500).json({ message: error.message });
    }
};
