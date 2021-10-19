const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const ewelink = require('ewelink-api');

const delay = time => new Promise(res => setTimeout(res, time));

/* docs: https://ewelink-api.vercel.app/docs/introduction */
const ewelinkConnection = new ewelink({
    email: 'lorenzo.maiorfi@k-digitale.com',
    password: 'lorenzo-1',
    region: 'eu',
});

const app = express();

// defining an array to work as the database (temporary solution)
const splash = {
    title: 'eWeLink HTTP Bridge here!'
};

// adding Helmet to enhance your API's security
app.use(helmet());

// using bodyParser to parse JSON bodies into JS objects
app.use(express.json());

// enabling CORS for all requests
app.use(cors());

// adding morgan to log HTTP requests
app.use(morgan('combined'));

// defining an endpoint to return all ads
app.get('/', (req, res) => {
    res.send(splash);
});

app.post('/pulse-on-off', async (req, res) => {
    await runDemo();

    res.sendStatus(204);
});

/* get all devices */
async function runDemo() {
    const devices = await ewelinkConnection.getDevices();

    console.log(devices);

    let device = devices[0];

    console.log(device.name, device.deviceid);

    let status = await ewelinkConnection.setDevicePowerState(device.deviceid, 'on');

    console.log(status);

    await delay(1000);

    status = await ewelinkConnection.setDevicePowerState(device.deviceid, 'off');

    console.log(status);
}

// starting the server
const port = process.env.PORT || 3001;

app.listen(port, () => {
    console.log(`Listener HTTP attivo sulla porta ${port}`);
});