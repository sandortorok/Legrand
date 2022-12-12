
const express = require("express");
router = express.Router();
var db = require('./connectMysql');

let sql = `SELECT * FROM extras`
db.query(sql, (err, result) => {
    if(err) throw err;
    let res = Object.values(JSON.parse(JSON.stringify(result)));
    require('../logic/logic').initExtras(res)
})


router.get('/', (req, res) =>{
    let sql = `SELECT * FROM extras`
    db.query(sql, (err, result) => {
        if(err) throw err;
        res.send(result);
    })
})

// router.post('/', (req, res) =>{
//     let msg = req.body;
//     console.log(msg);
//     let sql = `SELECT * FROM zones`
//     db.query(sql, (err, result) => {
//         if(err) throw err;
//         res.send(result);
//     })
// })

function saveExtras(zones){
    zones.forEach(el => {
        let sql = `UPDATE extras SET is_on = ${el.is_on} WHERE id = '${el.id}'`
        db.query(sql, (err, result) => {
            if(err) throw err;
        })
    });
}

module.exports = {router, saveExtras};