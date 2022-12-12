const { saveExtras } = require('../routes/extras');
const { saveMotions } = require('../routes/motions');
const { saveZones } = require('../routes/zones');

function input1(payload){
    let bin = dec2bin16(payload)
    bin = reverse(bin);
    let obj = {
      M1 : parseInt(bin[0]),
      M2 : parseInt(bin[1]),
      M3 : parseInt(bin[2]),
      M4 : parseInt(bin[3]),
      M5 : parseInt(bin[4]),
      M6 : parseInt(bin[5]),
      M7 : parseInt(bin[6]),
      M8 : parseInt(bin[7]),
      M9 : parseInt(bin[8]),
      M10 : parseInt(bin[9]),
      M11 : parseInt(bin[10]),
      M12 : parseInt(bin[11]),
      M13 : parseInt(bin[12]),
      KEZI_AUTO_NH : parseInt(bin[13]),
      KEZI_AUTO_1: parseInt(bin[14]),
      KEZI_AUTO_3_4: parseInt(bin[15]),
    }
    let extrasChanged = false;
    extras.forEach(extra=>{
        if(Object.keys(obj).includes(extra.id)){
            if(extra.is_on != obj[extra.id]){
                extra.is_on = obj[extra.id];
                console.log(`Extra ${extra.id} changed to ${extra.is_on}`);
                extrasChanged = true;
            }
        }
    })
    if(extrasChanged && saveExtras){
        saveExtras(extras);
    }
    let motionsChanged = false;
    myMotions.forEach(motion=>{
        if(Object.keys(obj).includes(motion.name)){
            if(motion.is_on != obj[motion.name]){
                console.log(`Motion ${motion.name} changed to ${motion.is_on}`);
                motion.is_on = obj[motion.name];
                if(motion.is_on){
                    let now = new Date()
                    now = now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
                    motion.lastSignal = new Date(now)
                }
                motionsChanged = true
            }
        }
    })
    if(motionsChanged && saveMotions){
        saveMotions(myMotions)
    }
    calculateOutput()
}

function input2(payload){
    let bin = dec2bin16(payload)
    bin = reverse(bin);
    let obj = {
        IS_50 : parseInt(bin[0])
    }
    let extrasChanged = false;
    extras.forEach(extra=>{
        if(Object.keys(obj).includes(extra.id)){
            if(extra.is_on != obj[extra.id]){
                extra.is_on = obj[extra.id];
                console.log(`Extra ${extra.id} changed to ${extra.is_on}`);
                extrasChanged = true;
            }
        }
    })
    if(extrasChanged && saveExtras){
        saveExtras(extras);
    }
    calculateOutput()
}

function initZones(initData){
    zones = initData
    console.log('zones', zones.length);
}

function initExtras(initData){
    extras = initData
    console.log('extras', extras.length);
}

function initMotions(initData){
    myMotions = initData
    console.log('motions', myMotions.length);
}



let myMotions = []
let zones = []
let extras = []

let outputs;

function calculateOutput(){
    ex = extras.reduce((a, v) => ({...a, [v.id]: v.is_on}), {});
    let zoneMotions = {}
    zones.forEach(zone=>{
        zoneMotions[parseInt(zone.id)] = []
    })
    myMotions.forEach(motion=>{
        zoneMotions[motion.zone].push(motion)
    })
    let autoList = []
    let keziList = []
    let is_50 = ex['IS_50']
    let kezi_auto = ex['KEZI_AUTO_NH']
    zones.forEach(z=>{
        z.is_50 = is_50;
    })
    if(ex['KEZI_AUTO_NH'] == 0){ //AUTOMATA
        [2,5,6,7,8,9,10,11,12,13].forEach(el=>{
            autoList.push(el)
        })
    }
    if(ex['KEZI_AUTO_NH'] == 1){ //KÉZI
        [2,5,6,7,8,9,10,11,12,13].forEach(el=>{
            keziList.push(el)
        })
    }
    if(ex['KEZI_AUTO_1'] == 0){ //AUTO
        autoList.push(1)
    }
    if(ex['KEZI_AUTO_3_4'] == 0){ //AUTO
        autoList.push(3)
        autoList.push(4)
    }
    if(ex['KEZI_AUTO_1'] == 1){ //KÉZI
        keziList.push(1)
    }
    if(ex['KEZI_AUTO_3_4'] == 1){ //KÉZI
        keziList.push(3)
        keziList.push(4)
    }
    autoList.forEach(autoNum=>{
        let zone_on = 0
        zoneMotions[`${autoNum}`].forEach(motion=>{
            if(motion.is_on){
                zone_on = 1
            }
        })
        zones.forEach(z=>{
            if(parseInt(z.id) == autoNum){
                if(z.is_on != zone_on){
                    z.is_on = zone_on
                    console.log(`Zone ${autoNum} changed to ${zone_on} (MOTION/AUTO)`);
                }
            }
        })
    })
    keziList.forEach(keziNum=>{
        zone_on = 0
        zones.forEach(z=>{
            if(parseInt(z.id) == keziNum){
                if(z.is_on != zone_on){
                    z.is_on = zone_on
                    console.log(`Zone ${keziNum} changed to ${zone_on} (MANUAL)`);
                }
            }
        })
    })
    // MAN10 2-zóna
    // MAN11 1: Automata 1-2 zóna, 0: Kézi 1-2 zóna --> 1-es mindig világít
    // MAN12 1: Automata 3-4 zóna, 0: Kézi 3-4 zóna --> 3-4 mindig világít
    zo = zones.reduce((a, v) => ({...a, [v.id]: v.is_on}), {});
    mo = myMotions.reduce((a, v) => ({...a, [v.id]: v.is_on}), {});

    // FINAL
    let output1 = `${zo['9']}${+(zo['8']&&!is_50)}${zo['8']}${+(zo['7']&&!is_50)}${zo['7']}${+(zo['6']&&!is_50)}${zo['6']}${+(zo['5']&&!is_50)}${zo['5']}${zo['4']}${zo['3']}${zo['2']}${zo['1']}${is_50}${+(ex['KEZI_AUTO_NH'])}1`;
    output1 = output1.split("").reverse().join("");
    outputs.output1({num: parseInt(output1, 2)})
    let output2 = `0000000${+(zo['13']&&!is_50)}${zo['13']}${+(zo['12']&&!is_50)}${zo['12']}${+(zo['11']&&!is_50)}${zo['11']}${+(zo['10']&&!is_50)}${zo['10']}${+(zo['9']&&!is_50)}`;
    output2 = output2.split("").reverse().join("");
    outputs.output2({num: parseInt(output2, 2)})

    //TEST
    // let output1 = `${mo['24']}${mo['24']}${mo['24']}${mo['24']}${mo['24']}${mo['24']}${mo['24']}${mo['24']}${mo['24']}${mo['26']}${mo['26']}${mo['17']}${mo['17']}001`
    // output1 = output1.split("") .reverse().join("");
    // outputs.output1({num: parseInt(output1, 2)})
    // let output2 = `0000000${mo['24']}${mo['24']}${mo['24']}${mo['24']}${mo['24']}${mo['24']}${mo['24']}${mo['24']}${mo['24']}`
    // output2 = output2.split("").reverse().join("");
    // outputs.output2({num: parseInt(output2, 2)})

    saveMotions(myMotions);
    saveZones(zones);
}
setTimeout(()=>{
    outputs = require('../communication/webSockets');
},10)

module.exports = {
    initExtras,
    initZones,
    initMotions,
    input1,
    input2
}

function dec2bin16(dec) {
    let bin = (dec >>> 0).toString(2);
    while(bin.length!=16){
        bin = "0" + bin;
    }
    return bin
}
function reverse(s){
    return s.split("").reverse().join("");
}