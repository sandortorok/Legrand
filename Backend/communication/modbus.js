
const express = require("express")
router = express.Router();

var ModbusRTU = require("modbus-serial");
var client = new ModbusRTU();

var db = require('../routes/connectMysql');
start();
var saveInterval

async function connect() {
    try {
        await client.connectRTUBuffered("/dev/ttyUSB0", { baudRate: 38400, dataBits: 8, stopBits: 1, parity: 'even' });
        await client.setID(5);
        console.log('\x1b[33m%s\x1b[0m', 'Connected to Modbus');
        return 0
    }
    catch (err) {
        return -1
    }
}

async function start() {
    if(saveInterval){
        clearInterval(await saveInterval)
    }
    saveInterval = undefined;
    // open connection to a serial port
    while (await connect() < 0) {
        console.log('try connect');
        const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
        await delay(5000) /// waiting 1 second.
    }
    saveInterval = regularSave();
}

async function regularSave(){
    return setInterval(async () => {
        let port_open = true
        for (const reg of [20480, 20482, 20484]) {
            let status_code = await readSaveRegister(reg, 'amperTable')
            if(status_code == -1){
                port_open = false
            }
        }
        for (const reg of [20509, 20511, 20513]) {
            let status_code = await readSaveRegister(reg, 'voltageTable')
            if(status_code == -1){
                port_open = false
            }
        }
        for (const reg of [20538, 20540, 20544, 20548]) {
            let status_code = await readSaveRegister(reg, 'powerTable')
            if(status_code == -1){
                port_open = false
            }
        }
        for (const reg of [20592, 20594, 20598, 20600]) {
            let status_code = await readSaveRegister(reg, 'kwTable')
            if(status_code == -1){
                port_open = false
            }
        }
        if(!port_open){
            start()
        }
    }, 1000 * 5);
}

setInterval(() => {
    saveArchive('amper')
    saveArchive('voltage')
    saveArchive('power')
    saveArchive('kw')
}, 1000 * 60 * 15)

setInterval(() => {
    deleteOld('amper')
    deleteOld('voltage')
    deleteOld('power')
    deleteOld('kw')
}, 1000 * 60 * 60 * 12)

module.exports = router;


async function readSaveRegister(register, tableName) {
    try {
        await client.readInputRegisters(register, 2).then(kwh => {

            binval = dec2bin16(kwh.data[0])+dec2bin16(kwh.data[1])
            if(register == 20548){
                binval = dec2bin16(kwh.data[0])
            }
            value = 0;
            if(register == 20540 || register == 20538 || register == 20548){ //MINUSZOSAK
                
                value = parseInt(binval.substring(1), 2)
                if(binval[0] == '1'){
                    value*=-1;
                }
            }
            else{
                value = parseInt(binval, 2)
            }
            if([20538, 20540, 20544].includes(register)){
                value/=100000
            }
            if([20480, 20482, 20484,20509, 20511, 20513, 20548].includes(register)){
                value/=1000
            }
            if([20592, 20594, 20598, 20600].includes(register)){
                value/=100
            }
            let now = new Date()
            now = now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
            let cur_date = new Date(now).toISOString().replace(/T/, ' ').replace(/\..+/, '')
            sql = `INSERT INTO ${tableName} (value, timestamp, type) values (${value}, '${cur_date}', ${register})`
            db.query(sql, (err, result) => {
                if (err) throw err;
            })
            return 0;
        });
        return 0
    }
    catch (err) {
        if(err.message == 'Port Not Open'){
            return -1;
        }
        return -2;
    }
}

function saveArchive(tableName){
    let now = new Date()
    let nowMinutes = now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
    let cur_date = new Date(nowMinutes).toISOString().replace(/T/, ' ').replace(/\..+/, '')

    let lastMinutes = now.setMinutes(now.getMinutes() - 15)
    let last_date = new Date(lastMinutes).toISOString().replace(/T/, ' ').replace(/\..+/, '');
    sql = `
        INSERT INTO ${tableName}Archive ( value, type, timestamp )
        SELECT avg(value) as value, type, '${cur_date}'
        FROM ${tableName}Table 
        WHERE timestamp < '${cur_date}' and timestamp > '${last_date}' 
        GROUP BY type;
    `
    db.query(sql, (err, result) => {
        if (err) throw err;
    })
    return;
}

async function deleteOld(tableName){
    sql = `DELETE FROM ${tableName}Table WHERE timestamp - interval 1 day < NOW()`;
    db.query(sql, (err, result) => {
        console.log(result);
        if (err) throw err;
    })
}
function dec2bin16(dec) {
    let bin = (dec >>> 0).toString(2);
    while(bin.length!=16){
        bin = "0" + bin;
    }
    return bin
}