import { Component } from '@angular/core';
import { WebsocketService } from './services/web-socket.service';

interface element{
  bit: Number,
  name: String,
  is_on: Boolean
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private ws: WebsocketService){ }
  title = 'test';
  inputs1: element[] = []
  inputs2: element[] = []

  outputs1: element[] = []
  outputs2: element[] = []

  ngOnInit(){
    this.initValues()
    this.ws.outputMessage$.subscribe(data=>{
      if(data.topic == 'output1'){
        let binary = (data.num >>> 0).toString(2);
        while(binary.length!=16){
          binary = "0"+binary
        }
        for(let i = 0; i < 16; i++){
          if(parseInt(binary[i])==1){
            this.outputs1[i].is_on = true
          }
          if(parseInt(binary[i])==0){
            this.outputs1[i].is_on = false
          }
        }
      }
      if(data.topic == 'output2'){
        let binary = (data.num >>> 0).toString(2);
        while(binary.length!=16){
          binary = "0"+binary
        }        
        for(let i = 0; i < 16; i++){
          if(parseInt(binary[i])==1){
            this.outputs2[i].is_on = true
          }
          if(parseInt(binary[i])==0){
            this.outputs2[i].is_on = false
          }
        }
      }
      if(data.topic == 'input1'){
        let binary = (data.num >>> 0).toString(2);
        binary = binary.split("").reverse().join(""); //REVERSE
        while(binary.length!=16){
          binary = binary + "0"
        }
        for(let i = 0; i < 16; i++){
          if(parseInt(binary[i])==1){
            this.inputs1[i].is_on = true
          }
          if(parseInt(binary[i])==0){
            this.inputs1[i].is_on = false
          }
        }
      }
      if(data.topic == 'input2'){
        let binary = (data.num >>> 0).toString(2);
        binary = binary.split("").reverse().join(""); //REVERSE
        while(binary.length!=16){
          binary = binary + "0"
        }
        for(let i = 0; i < 16; i++){
          if(parseInt(binary[i])==1){
            this.inputs2[i].is_on = true
          }
          if(parseInt(binary[i])==0){
            this.inputs2[i].is_on = false
          }
        }
      }
      console.log(data);
    })
  }
  inputChanged(idx: number){
    let arr:element[] = []
    if(idx == 0){
      arr = this.inputs1
    }
    else if(idx == 1){
      arr = this.inputs2
    }
    let binaryString: string = ""
    arr.forEach(el=>{
      if(el.is_on){
        binaryString += "1"
      }
      else{
        binaryString += "0"
      }
    })
    binaryString = binaryString.split("").reverse().join(""); //REVERSE
    let myint = parseInt(binaryString, 2 );
    this.ws.sendMessage(JSON.stringify({num: myint,topic: `Input/${idx+1}`}))
  }
  initValues(){
    for(let i = 0; i < 13; i++){
      this.inputs1.push({
        bit:i+1,
        name: `M${i+1} mozgásérzékelő`,
        is_on: false
      })
    }
    this.inputs1.push({
      bit: 14,
      name: 'Nagy Helység Auto/Kézi',
      is_on: false
    })
    this.inputs1.push({
      bit: 15,
      name: 'Zóna 1 Auto/Kézi',
      is_on: false
    })
    this.inputs1.push({
      bit: 16,
      name: 'Zóna 3-4 Auto/Kézi',
      is_on: false
    })
    this.inputs2.push({
      bit: 1,
      name: '50%-os kapcsoló',
      is_on: false
    })
    while(this.inputs2.length != 16){
      this.inputs2.push({
        bit: this.inputs2.length+1,
        name: '-----',
        is_on: false
      })
    }
    this.outputs1.push({
      bit: 1,
      name: "------",
      is_on: false
    })
    this.outputs1.push({
      bit: 2,
      name: "------",
      is_on: false
    })
    this.outputs1.push({
      bit: 3,
      name: "LED3 - 50%-os",
      is_on: false
    })
    for(let i = 0; i < 4; i++){
      this.outputs1.push({
        bit: i+4,
        name: `Imp relé zóna ${i+1}`,
        is_on: false
      })
    }
    for(let i = 0; i < 4; i++){
      for(let j = 0; j<2; j++){
        this.outputs1.push({
          bit: i*2+j+1+7,
          name: `Imp relé zóna ${i+5}_${j+1}`,
          is_on: false
        })
      }
    }
    this.outputs1.push({
      bit: 16,
      name: `Imp relé zóna 9_1`,
      is_on: false
    })
    this.outputs2.push({
      bit: 1,
      name: `Imp relé zóna 9_2`,
      is_on: false
    })
    for(let i = 0; i < 4; i++){
      for(let j = 0; j<2; j++){
        this.outputs2.push({
          bit: i*2+j+2,
          name: `Imp relé zóna ${i+10}_${j+1}`,
          is_on: false
        })
      }
    }
    for(let i = 0; i < 3; i++){
      this.outputs2.push({
        bit: i*2+10,
        name: `------`,
        is_on: false
      })
      this.outputs2.push({
        bit: i*2+11,
        name: `------`,
        is_on: false
      })
    }
    this.outputs2.push({
      bit: 16,
      name: `-------`,
      is_on: false
    })
  }
}
