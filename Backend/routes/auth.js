const jwt = require('jsonwebtoken')
const express = require("express");
router = express.Router();
var db = require('./connectMysql');

let secretkey = 'secretkey'

function verifyToken(req, res, next){
    if(!req.headers.authorization){
      return res.status(401).send('Unauthorized request')
    }
    let token = req.headers.authorization.split(' ')[1]
    if (token === "null"){
      return res.status(401).send('Unauthorized request')
    }
    try{
        let payload = jwt.verify(token, secretkey)
        if(!payload){
          return res.status(401).send('Unauthorized request')
        }
        res.locals.id = payload._id
        res.locals.exp = payload.exp
        next()
    }
    catch(err){
        res.status(401).send('Invalid or expired token')
    }
  }

router.post('/login', (req, res) => {
    let msg = req.body;
    let sql = `SELECT * FROM users WHERE username = '${msg.username}'`;
    let query = db.query(sql, (err, result, fields) => {
        if(err) throw err;
        if(result[0] === undefined){
            res.status(401).send('Invalid username')
        }
        else if (result[0]['password'] !== msg.password){
            res.status(401).send('Invalid password')
        }
        else if (result[0]['password'] === msg.password){
            let limit = 2000
            let expires = Math.floor(Date.now() / 1000)+limit
            let payload = {
                _id : result[0]['id'],
                exp : expires
            }
            let token = jwt.sign(payload, secretkey)
            res.status(200).send({token})
        }
    })
})
router.post('/register', (req, res) => {
    let msg = req.body;
    let sql = `SELECT * FROM users WHERE username = '${msg.username}'`;
    let query = db.query(sql, (err, result) => {
        if(err) throw err;
        if(result[0] === undefined){
            let id = Math.random().toString(36).substring(2,12)
            let sql2 = `insert into users(id, username, password) values ('${id}','${msg.username}', '${msg.password}')`;
            db.query(sql2, (err, result) => {
                if(err) throw err;
                let limit = 2000
                let expires = Math.floor(Date.now() / 1000)+limit
                let payload = {
                    _id : id,
                    exp : expires
                }
                let token = jwt.sign(payload, secretkey)    
                res.status(200).send({token})
            })
        }
        else {
            res.status(401).send('Username already in use!')
        }
    })
})
router.get("/admin", verifyToken, (req, res)=>{
    let diff = res.locals.exp - new Date() / 1000 
    res.send({msg:'ok', id:res.locals.id, diff:diff})
})

// simple route
router.get("/", (req, res) => {
    res.json({ Title: "Air Condition Backend" });
});

module.exports = router;