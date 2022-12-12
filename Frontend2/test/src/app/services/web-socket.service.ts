import { EventEmitter, Injectable, Output } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  @Output() wsMessage = new EventEmitter();
  outputMessage$ = new Subject<{num: number, topic: String}>();
  webSocket: WebSocket = new WebSocket('ws://192.168.4.1:3000/');
  constructor() { 
    this.openWebSocket();
  }

  public openWebSocket(){
    this.webSocket.onopen = (event) => {
      console.log('Open: ', event);
    };

    this.webSocket.onmessage = (event) => {
      this.webSocket.addEventListener
      // if(this.isJsonString(event.data)){
      //   let data = JSON.parse(event.data)
      //   if (data.topic === 'switches/Data'){
      //     this.switchMessage$.next(JSON.parse(data.payload))
      //   }
      // }
      // else{
      //   this.wsMessage.emit(event.data);
      // }
      if(this.isJsonString(event.data)){
        let data = JSON.parse(event.data)
        if(data.topic == 'output1'){
          this.outputMessage$.next(data)
        }
        if(data.topic == 'output2'){
          this.outputMessage$.next(data)
        }
        if(data.topic == 'input1'){
          this.outputMessage$.next(data)
        }
        if(data.topic == 'input2'){
          this.outputMessage$.next(data)
        }
      }    
    };

    this.webSocket.onclose = (event) => {
      console.log('Close: ', event);
    };
  }

  public sendMessage(msg:string){
    this.webSocket.send(msg);
  }

  public closeWebSocket() {
    this.webSocket.send('Websocket Closed');
    this.webSocket.close();
  }
  public isJsonString(str: string) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
  }
  destructor(){
    this.closeWebSocket();
  }
}