import { NotificationService, Color } from './notification.service';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  @Output() wsMessage = new EventEmitter();
  outputMessage$ = new Subject<String>();
  // webSocket: WebSocket = new WebSocket('ws://10.100.0.233:3000/');
  // webSocket: WebSocket = new WebSocket('ws://192.168.4.1:3000/');
  webSocket: WebSocket = new WebSocket('ws://localhost:3000/');

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
          if(localStorage.getItem('output1') != data.num){
            localStorage.setItem('output1', data.num)
            this.outputMessage$.next('changes on output1')
          }
        }
        if(data.topic == 'output2'){
          if(localStorage.getItem('output2') != data.num){
            localStorage.setItem('output2', data.num)
            this.outputMessage$.next('changes on output2')
          }
        }
      }    
    };

    this.webSocket.onclose = (event) => {
      console.log('Close: ', event);
    };
  }

  public sendMessage(msg){
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