
const express = require("express");
router = express.Router();
var db = require('./connectMysql');

router.get('/', (req, res) =>{
    let sql = `SELECT * FROM notifications`
    db.query(sql, (err, result) => {
        if(err) throw err;
        res.send(result);
    })
})

router.get('/nextid', (req, res) =>{
    let sql = `SELECT max(id)+1 as next_id FROM notifications`
    db.query(sql, (err, result) => {
        if(err) throw err;
        res.send(result);
    })
})

router.post('/add', (req, res) =>{
    let msg = req.body;
    let sql = `INSERT INTO notifications (id, text, icon, seen, color) values (${msg.id},'${msg.text}', '${msg.icon}', ${msg.seen}, '${msg.color}')`
    db.query(sql, (err, result) => {
        if(err) throw err;
        res.send(result);
    })
})

router.patch('/seen', (req, res) =>{
    let msg = req.body;
    let sql = `UPDATE notifications set seen=${true} where id = ${msg.id}`
    db.query(sql, (err, result) => {
        if(err) throw err;
        res.send(result);
    })
})
module.exports = router;