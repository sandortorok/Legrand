import { HttpService } from './http.service';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';

export enum Color {
  primary = 'primary', 
  info = 'info', 
  success = 'success', 
  warning = 'warning', 
  danger = 'danger'
}
export interface Notification{
  id?: number,
  color: Color,
  text: String,
  seen: Boolean,
  icon: String
}
@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notification$ = new BehaviorSubject<Notification[]>([]);
  notificationCast = this.notification$.asObservable();
  constructor(private toastr: ToastrService, private httpService: HttpService) {
    this.httpService.getNotifications().subscribe(res=>{
      let notifications = Object.values(res)
      this.notification$.next(notifications);
    })
  }
  newNotification(notification:Notification){
    let from = 'top';
    let align = 'center';
    let icon = notification.icon
    if(!notification.hasOwnProperty('icon')){
      icon = "icon-bell-55"
    }
    
    this.toastr.info(`<span class="tim-icons ${icon}" [data-notify]="icon"></span>${notification.text}`, '', {
      closeButton: true,
      enableHtml: true,
      toastClass: `alert alert-${notification.color} alert-with-icon`,
      positionClass: 'toast-' + from + '-' +  align,
      newestOnTop: true,
      progressBar: true,
      timeOut: 5000,
      extendedTimeOut: 1000,
    });
    this.httpService.nextNotificationID().subscribe(res=>{
      notification = {...notification, id:res[0]['next_id']}
      this.httpService.addNotification(notification).subscribe(res2=>{})      
      this.addNotification(notification)
    })
  }
  setNotifications(notifications: Notification[]) {
    // this.httpService.setNotifications(notifications).subscribe(res=>{})
    this.notification$.next(notifications);
  }
  addNotification(n: Notification){
    let current = this.notification$.value
    this.notification$.next([...current, n])
  }
}
