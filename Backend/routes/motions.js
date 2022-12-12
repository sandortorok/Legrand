
const express = require("express");
router = express.Router();
var db = require('./connectMysql');

let sql = `SELECT * FROM motionSensors ORDER BY id`
db.query(sql, (err, result) => {
    if(err) throw err;
    let res = Object.values(JSON.parse(JSON.stringify(result)));
    require('../logic/logic').initMotions(res);
})

router.get('/', (req, res) =>{
    let sql = `SELECT * FROM motionSensors ORDER BY zone, id`
    db.query(sql, (err, result) => {
        if(err) throw err;
        res.send(result);
    })
})

function saveMotions(motions){
    motions.forEach(el => {
        let id = el.id;
        let is_on = el.is_on
        let sql;
        if(el.lastSignal == null){
            sql = `UPDATE motionSensors SET is_on = ${is_on}, lastSignal = NULL WHERE id = '${id}'`
        }
        else if(typeof el.lastSignal == 'string'){
            sql = `UPDATE motionSensors SET is_on = ${is_on}, lastSignal='${new Date(el.lastSignal).toISOString().replace(/T/, ' ').replace(/\..+/, '')}' WHERE id = '${id}'`

        }
        else{
            sql = `UPDATE motionSensors SET is_on = ${is_on}, lastSignal='${el.lastSignal.toISOString().replace(/T/, ' ').replace(/\..+/, '')}' WHERE id = '${id}'`
        }
        db.query(sql, (err, result) => {
            if(err) throw err;
        })
    });
}
module.exports = {router, saveMotions};