
const express = require("express");
router = express.Router();
var db = require('./connectMysql');

router.get('/years', (req, res) =>{
    let sql = `
        SELECT
            type as type,
            AVG(value) as value,
            YEAR(timestamp) as year
        FROM amperArchive
        GROUP BY type, year
        ORDER BY year DESC;
    `
    db.query(sql, (err, result) => {
        if(err) throw err;
        res.send(result);
    })
})

router.post('/year', (req, res) =>{
    let body = req.body
    let date = body.date
    let sql = `
        SELECT
            type as type,
            AVG(value) as value,
            YEAR(timestamp) as year,
            MONTH(timestamp) as month
        FROM amperArchive
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
    let body = req.body
    let date = body.date
    let sql = `
        SELECT
            type as type,
            AVG(value) as value,
            DATE(timestamp) as date
        FROM amperArchive
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
    let body = req.body
    let date = body.date
    let sql = `
        SELECT
            type as type,
            AVG(value) as value,
            DATE(timestamp) as date
        FROM amperArchive
        WHERE YEAR(timestamp) = YEAR('${date}') AND WEEK(timestamp, 1) = WEEK('${date}', 1)
        GROUP BY type, date
        ORDER BY date DESC;
    `
    db.query(sql, (err, result) => {
        if(err) throw err;
        res.send(result);
    })
})

router.post('/day', (req, res) => {
    let body = req.body
    let date = body.date
    let sql = `
        SELECT
            type as type,
            AVG(value) as value,
            DATE(timestamp) as date,
            HOUR(timestamp) as hour
        FROM amperArchive
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
        FROM amperTable
        WHERE DATE(timestamp) = '${date}' AND HOUR(timestamp) = ${hour}
        GROUP BY type, date, hour, minute;
    `
    db.query(sql, (err, result) => {
        if(err) throw err;
        res.send(result);
    })
})

// router.get('/gen_random_data', (req, res)=>{
//     let sql =`INSERT INTO amperTable (value, timestamp, type) values (1, '2022-01-01 00:00:00', 1)`
//     let start_date = new Date(2022, 0, 1, 1, 0, 0);
//     let cur_amp = 10
//     for(let i = 0; i < 20000; i++){
//         date = start_date.toISOString().replace(/T/, ' ').replace(/\..+/, '')
//         let random = Math.random() * (100-1) + 1
//         cur_amp = random
//         sql += `,(${cur_amp}, '${date}', 1)`
//         start_date = new Date(start_date.getTime() + 5 * 1000);
//     }
//     deleteSQL = 'show tables;'
//     db.query(deleteSQL, (err, result) =>{
//         if(err) throw err;
//         console.log('deleted existing data');
//         db.query(sql, (err, result) => {
//             if(err) throw err;
//             res.send(result);
//             sql2 = 'delete from powerTable where value = 1'
//             db.query(sql2, (err, result)=>{
//                 if(err) throw err;
//                 console.log('Deleted the extra record');
//             })
//         })
//     })
// })
module.exports = router;