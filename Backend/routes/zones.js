
const express = require("express");
router = express.Router();
var db = require('./connectMysql');

let sql = `SELECT * FROM zones ORDER BY id`
db.query(sql, (err, result) => {
    if(err) throw err;
    let res = Object.values(JSON.parse(JSON.stringify(result)));
    require('../logic/logic').initZones(res)
})


router.get('/', (req, res) =>{
    let sql = `SELECT * FROM zones ORDER BY id`
    db.query(sql, (err, result) => {
        if(err) throw err;
        res.send(result);
    })
})

router.post('/', (req, res) =>{
    let msg = req.body;
    console.log(msg);
    res.send('yooooooo')
//     let sql = `SELECT * FROM zones`
//     db.query(sql, (err, result) => {
//         if(err) throw err;
//         res.send(result);
//     })
})

router.patch('/:id', (req, res) =>{
    let id = req.params.id;
    let is_on = req.body.is_on
    let sql = `UPDATE zones SET is_on = ${is_on} WHERE id = '${id}'`
    db.query(sql, (err, result) => {
        if(err) throw err;
        res.send(result);
    })
})

router.put('/is50', (req, res) =>{
    let is_50 = req.body.is_50
    let sql = `UPDATE zones SET is_50 = ${is_50}`
    db.query(sql, (err, result) => {
        if(err) throw err;
        res.send(result);
    })
})

function saveZones(zones){
    zones.forEach(el => {
        let sql = `UPDATE zones SET is_on = ${el.is_on}, is_50 = ${el.is_50} WHERE id = ${el.id}`
        db.query(sql, (err, result) => {
            if(err) throw err;
        })
    });
}

module.exports = {router, saveZones};