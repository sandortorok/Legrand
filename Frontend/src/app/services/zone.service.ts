import { WebsocketService } from './web-socket.service';
import { HttpService } from './http.service';
import { Color, NotificationService } from './notification.service';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Zone{
  id: Number,
  is_on: Boolean,
  is_50: Boolean
}

@Injectable({
  providedIn: 'root'
})
export class ZoneService {
  private zone$ = new BehaviorSubject<Zone[]>([]);
  zoneCast = this.zone$.asObservable();

  constructor(private notificationService: NotificationService, private httpService: HttpService, private wsService: WebsocketService) {
    this.httpService.getZones().subscribe(res=>{
      let zones:Zone[] = Object.values(res)
      this.zone$.next(zones);
    })
    this.wsService.outputMessage$.subscribe(msg=>{
      setTimeout(() => {
        this.httpService.getZones().subscribe(res=>{
          let zones:Zone[] = Object.values(res)
          this.zone$.next(zones);
        })
      }, 1000);
    })
  }
  setZones(zones: Zone[]){
    this.httpService.setZones(zones).subscribe(res=>{})
    this.zone$.next(zones);
  }
}
