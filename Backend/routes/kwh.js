
const express = require("express")
router = express.Router();
var db = require('./connectMysql');



router.get('/data', (req, res)=>{
    let sql = `SELECT * FROM kwArchive`;
    db.query(sql, (err, result) => {
        if(err) throw err;
        res.send(result);
    })
})

router.get('/years', (req, res) =>{
    let sql = `
        SELECT
            type as type,
            AVG(value) as value,
            YEAR(timestamp) as year
        FROM kwArchive
        GROUP BY type, year
        ORDER BY year DESC;
    `
    db.query(sql, (err, result) => {
        if(err) throw err;
        res.send(result);
    })
})

router.post('/year', (req, res) =>{
    msg = req.body
    let date = msg.date
    let sql = `
        SELECT
            type as type,
            AVG(value) as value,
            YEAR(timestamp) as year,
            MONTH(timestamp) as month
        FROM kwArchive
        WHERE YEAR(timestamp) = YEAR('${date}')
        GROUP BY type, year, month
        ORDER BY year DESC, month DESC;
    `
    db.query(sql, (err, result) => {
        if(err) throw err;
        res.send(result);
    })
})

router.post('/month', (req, res) =>{
    msg = req.body
    let date = msg.date
    let sql = `
        SELECT
            type as type,
            AVG(value) as value,
            DATE(timestamp) as date
        FROM kwArchive
        WHERE YEAR(timestamp) = YEAR('${date}') AND MONTH(timestamp) = MONTH('${date}')
        GROUP BY type, date
        ORDER BY date DESC;
        `
    db.query(sql, (err, result) => {
        if(err) throw err;
        res.send(result);
    })
})

router.post('/week', (req, res) =>{
    msg = req.body
    let date = msg.date
    let sql = `
        SELECT
            type as type,
            AVG(value) as value,
            DATE(timestamp) as date
        FROM kwArchive
        WHERE YEAR(timestamp) = YEAR('${date}') AND WEEK(timestamp, 1) = WEEK('${date}', 1)
        GROUP BY type, date
        ORDER BY date DESC;
    `
    db.query(sql, (err, result) => {
        if(err) throw err;
        res.send(result);
    })
})

router.post('/day', (req, res) =>{
    msg = req.body
    let date = msg.date
    let sql = `
        SELECT
            type as type,
            AVG(value) as value,
            DATE(timestamp) as date,
            HOUR(timestamp) as hour
        FROM kwArchive
        WHERE DATE(timestamp) = '${date}'
        GROUP BY type, date, hour
        ORDER BY date DESC, hour DESC;
    `
    db.query(sql, (err, result) => {
        if(err) throw err;
        res.send(result);
    })
})

router.post('/hour', (req, res)=>{
    let body = req.body
    let date = body.date
    let hour = body.hour
    let sql = `
        SELECT
            type as type,
            AVG(value) as value,
            DATE(timestamp) as date,
            HOUR(timestamp) as hour,
            MINUTE(timestamp) as minute
        FROM kwTable
        WHERE DATE(timestamp) = '${date}' AND HOUR(timestamp) = ${hour}
        GROUP BY type, date, hour, minute;
    `
    db.query(sql, (err, result) => {
        if(err) throw err;
        res.send(result);
    })
})

// router.get('/gen_random_data', (req, res)=>{
//     let sql =`INSERT INTO kwArchive (value, timestamp, type) values (1, '2022-01-01 00:00:00', 4)`
//     start_date = new Date(2022, 0, 1, 1, 0, 0);
//     cur_value = 12003
//     for(let i = 0; i < 20000; i++){
//         date = start_date.toISOString().replace(/T/, ' ').replace(/\..+/, '')
//         console.log(date);
//         let random = Math.random() * (10-1) + 1
//         cur_value += random
//         sql += `,(${cur_value}, '${date}', 4)`;
//         start_date = new Date(start_date.getTime() + (60 * 60 * 1000));
//     }

//     db.query(sql, (err, result) => {
//         if(err) throw err;
//         res.send(result);
//     })
// })

module.exports = router;







