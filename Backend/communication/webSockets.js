var server = require('../index')
const WebSocket = require('ws');

const wss = new WebSocket.Server({server:server});
const mqtt = require('mqtt');
const host = 'mqtt://localhost:1883';
const client = mqtt.connect(host);


wss.on('connection', ws => {
  ws.on('message', message=> {
    let topic = JSON.parse(message).topic;
    let num = JSON.parse(message).num.toString();

    client.publish(topic, num, { qos: 0, retain: false }, (error) => {
      if (error) {
        console.error(error)
      }
    })
  });
});
function sendMSG(message){
  wss.clients.forEach(client=>{
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);        
    }
  });
}
    
const topic1 = 'Input/1';
const topic2 = 'Input/2';

client.on('connect', () => {
  console.log('Connected to MQTT');
  client.subscribe([topic1], () => {
    console.log(`Subscribe to topic "${topic1}"`);
  })
  client.subscribe([topic2], () => {
    console.log(`Subscribe to topic "${topic2}"`);
  })
  client.subscribe(['Output/1'], () => {
    console.log(`Subscribe to topic "Output/1"`);
  })
  client.subscribe(['Output/2'], () => {
    console.log(`Subscribe to topic "Output/2"`);
  })
})

const logicFunctions = require('../logic/logic')
client.on('message', (topic, payload) => {
  if(topic === topic1){
    logicFunctions.input1(parseInt(payload.toString()));
    let newMsg = {num: parseInt(payload.toString()), topic: 'input1'}
    sendMSG(JSON.stringify(newMsg));
  }
  else if(topic === topic2){
    logicFunctions.input2(parseInt(payload.toString()));
    let newMsg = {num: parseInt(payload.toString()), topic: 'input2'}
    sendMSG(JSON.stringify(newMsg));
  }
  else{
    newMsg = {topic: topic, payload:payload.toString()};
    sendMSG(JSON.stringify(newMsg));
  }
})

function output1(msg){
  let newMsg = {...msg, topic: 'output1'}
  client.publish('Output/1', JSON.stringify(newMsg), { qos: 0, retain: false }, (error) => {
    if (error) {
      console.error(error)
    }
    sendMSG(JSON.stringify(newMsg));
  })
}
function output2(msg){
  let newMsg = {...msg, topic: 'output2'}
  client.publish('Output/2', JSON.stringify(newMsg), { qos: 0, retain: false }, (error) => {
    if (error) {
      console.error(error)
    }
    sendMSG(JSON.stringify(newMsg));
  })
}

module.exports={
  output1,
  output2
}