const express = require('express');
const router = require('./routes'); // Router
const cors = require('cors');       // CORS fix
require('dotenv').config();         // Environment variables from .env

const app = express();
app.use(cors());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/", router);

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});