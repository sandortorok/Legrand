import { WebsocketService } from './web-socket.service';
import { HttpService } from './http.service';
import { Color, NotificationService } from './notification.service';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Motion{
  id: Number,
  is_on: Boolean,
  name: String,
  zone:Number,
  lastSignal: Date
}

@Injectable({
  providedIn: 'root'
})
export class MotionService {
  private motion$ = new BehaviorSubject<Motion[]>([]);
  motionCast = this.motion$.asObservable();

  constructor(private notificationService: NotificationService, private httpService: HttpService, private wsService: WebsocketService) {
    this.httpService.getMotions().subscribe(res=>{
      let motions:Motion[] = Object.values(res)
      this.motion$.next(motions);
    })
    this.wsService.outputMessage$.subscribe(msg=>{
      setTimeout(() => {
        this.httpService.getMotions().subscribe(res=>{
          let motions:Motion[] = Object.values(res)
          this.motion$.next(motions);
        })
      }, 1000);
    })
  }
  setMotions(motions: Motion[]){
    this.httpService.setMotions(motions).subscribe(res=>{})
    this.motion$.next(motions);
  }
}
