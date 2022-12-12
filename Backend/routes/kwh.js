
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
            x.type,
            x.year,
            y.minvalue-x.minvalue as value
        FROM (
            SELECT
                type,
                year(timestamp) as year,
                year(timestamp + interval 1 year) as n_year,
                min(value) as minvalue
            FROM kwArchive 
            GROUP BY type, year, n_year
            ORDER BY year DESC
        ) as x
        INNER JOIN (
            SELECT
                type,
                year(timestamp) as year,
                min(value) as minvalue
            FROM kwArchive 
            GROUP BY type, year
            ORDER BY year DESC
        ) as y on x.type = y.type and x.n_year = y.year
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
            x.type,
            x.year,
            x.month,
            y.minvalue-x.minvalue as value
        FROM (
            SELECT
                type,
                year(timestamp) as year,
                month(timestamp) as month,
                year(timestamp + interval 1 month) as n_year,
                month(timestamp + interval 1 month) as n_month,
                min(value) as minvalue
            FROM kwArchive
            WHERE YEAR(timestamp) = YEAR('${date}')
            GROUP BY type, year, month, n_year, n_month
            ORDER BY year DESC, month DESC
        ) as x
        INNER JOIN (
            SELECT
                type,
                year(timestamp) as year,
                month(timestamp) as month, 
                min(value) as minvalue
            FROM kwArchive 
            GROUP BY type, year, month
            ORDER BY year DESC, month DESC
        ) as y on x.type = y.type and x.n_year = y.year and x.n_month = y.month
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
            x.type,
            x.date,
            y.minvalue-x.minvalue as value
        FROM (
        SELECT
            type,
            date(timestamp) as date,
            date(timestamp + interval 1 day) as n_date,
            min(value) as minvalue
        FROM kwArchive 
        WHERE YEAR(timestamp) = YEAR('${date}') AND MONTH(timestamp) = MONTH('${date}')
        GROUP BY type, date, n_date
        ORDER BY date DESC
        ) as x
        INNER JOIN (
            SELECT
                type,
                date(timestamp) as date,
                min(value) as minvalue
            FROM kwArchive
            GROUP BY type, date
            ORDER BY date DESC
        ) as y on x.type = y.type and x.n_date = y.date;
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
            x.type,
            x.date,
            y.minvalue-x.minvalue as value
        FROM (
        SELECT
            type,
            date(timestamp) as date,
            date(timestamp + interval 1 day) as n_date,
            min(value) as minvalue
        FROM kwArchive 
        WHERE YEAR(timestamp) = YEAR('${date}') AND WEEK(timestamp, 1) = WEEK('${date}', 1)
        GROUP BY type, date, n_date
        ORDER BY date DESC
        ) as x
        INNER JOIN (
            SELECT
                type,
                date(timestamp) as date,
                min(value) as minvalue
            FROM kwArchive
            GROUP BY type, date
            ORDER BY date DESC
        ) as y on x.type = y.type and x.n_date = y.date;
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
            x.type,
            x.date,
            x.hour,
            y.minvalue-x.minvalue as value
        FROM (
            SELECT
                type,
                date(timestamp) as date,
                hour(timestamp) as hour,
                date(timestamp + interval 1 hour) as n_date,
                hour(timestamp + interval 1 hour) as n_hour,
                min(value) as minvalue
            FROM kwArchive
            WHERE DATE(timestamp) = DATE('${date}')
            GROUP BY type, date, hour, n_date, n_hour
            ORDER BY date DESC, hour DESC
            ) as x
        INNER JOIN (
            SELECT
                type,
                date(timestamp) as date,
                hour(timestamp) as hour,
                min(value) as minvalue
            FROM kwArchive
            GROUP BY type, date, hour
            ORDER BY date DESC, hour DESC
            ) as y on x.type = y.type and x.n_date = y.date and x.n_hour = y.hour
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







