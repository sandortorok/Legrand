
var mysql = require('mysql');
var db = mysql.createPool({
    connectionLimit : 10,
    host: "localhost",
    user: "Sanyi",
    password: "sakkiraly11",
    database:'energyDB'
});


module.exports = db