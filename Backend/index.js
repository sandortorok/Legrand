var express = require('express');
app = express();

const server = module.exports = require('http').createServer(app);

require('./communication/webSockets');
var modbus = require('./communication/modbus');
var kwh = require('./routes/kwh');
var amp = require('./routes/amper');
var pow = require('./routes/power');
var volt = require('./routes/voltage');
var extras = require('./routes/extras').router;
var zones = require('./routes/zones').router;
var motions = require('./routes/motions').router;

var notifications = require('./routes/notifications');
var auth = require('./routes/auth');

const cors = require("cors")
app.use(cors());
app.use(express.json())

const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/modbus', modbus);
app.use('/kwh', kwh);
app.use('/amp', amp);
app.use('/pow', pow);
app.use('/volt', volt);
app.use('/extras', extras);
app.use('/zones', zones);
app.use('/motions', motions);
app.use('/notifications', notifications);
app.use('/auth', auth);

server.listen(port, () => {
    console.log('\x1b[36m%s\x1b[0m', `App Running on http://localhost:${port}`, '🥦 🥦 🥦')
})