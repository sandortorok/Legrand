import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Notification } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  
  // private url:string = 'http://10.100.0.233:3000';
  // private url:string = "http://192.168.4.1:3000";
  private url:string = "http://localhost:3000";

  constructor(private http:HttpClient) { }

  getYears(endPointName:String){
    return this.http.get(this.url + `/${endPointName}/years`);
  }

  getYear(endPointName:String, date){
    return this.http.post(this.url + `/${endPointName}/year`, {date: date});
  }

  getMonth(endPointName:String, date){
    return this.http.post(this.url + `/${endPointName}/month`, {date: date});
  }

  getWeek(endPointName:String, date){
    return this.http.post(this.url + `/${endPointName}/week`, {date: date});
  }

  getDay(endPointName:String, date){
    return this.http.post(this.url + `/${endPointName}/day`, {date: date});
  }

  getToday(endPointName: String, date, hour){
    return this.http.post(this.url + `/${endPointName}/hour`, {date: date, hour: hour})
  }

  getZones(){
    return this.http.get(this.url+'/zones');
  }

  setZones(body){
    return this.http.post(this.url+'/zones', body);
  }

  getMotions(){
    return this.http.get(this.url+'/motions')
  }

  setMotions(body){
    return this.http.post(this.url+'/motions', body);
  }

  getNotifications(){
    return this.http.get(this.url+'/notifications');
  }

  addNotification(n:Notification){
    return this.http.post(this.url+'/notifications/add', n);
  }

  seenNotification(notification:Notification){
    return this.http.patch(this.url+'/notifications/seen', notification);
  }

  nextNotificationID(){
    return this.http.get(this.url+'/notifications/nextid');
  }
}
