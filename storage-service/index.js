require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
const axios = require('axios')
var fs = require('fs');

const app = express();
app.use(bodyParser.json())
app.use(cors());
// app.use('/', express.static("/var/www/html/"))
// End basic express boilerplate

app.get('/hello', async (req, res) => {
    return res.json({ "success": new Date() });
})
app.post('/save-file', async (req, res) => {
    let { data, fileName, folderName } = req.body;
    if (!fs.existsSync('files')) {
        fs.mkdirSync('files');
    }

    // await fs.writeFileSync(`files/${fileName}`, data, { encoding: 'utf8'})
    let buff = Buffer.from(data, 'base64');
    fs.writeFileSync(`${folderName}/${fileName}`, buff);
    return res.json({ "success": true });
});

if (process?.env?.PORT === 3002)
    console.log('port is loaded using process.env.PORT');
else {
    console.log('hardcoded port is used',process.env?.NODE_ENV);
}

app.listen(process.env.PORT || 3002);
