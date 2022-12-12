import { HttpService } from './../../services/http.service';
import { Color, NotificationService } from './../../services/notification.service';
import { ZoneService, Zone } from '../../services/zone.service';
import { Component, OnInit } from "@angular/core";


@Component({
  selector: "app-switches",
  templateUrl: "switches.component.html",
  styleUrls: ["./switches.component.scss"]
})
export class SwitchesComponent implements OnInit {
  constructor(private switchService: ZoneService, private notificationService: NotificationService, private httpService: HttpService) {}
  zones: Zone[]
  is_50:Boolean = false;
  ngOnInit() {
    this.switchService.zoneCast.subscribe(zones=>{
      this.zones = zones
      if(zones.length > 0){
        this.is_50 = zones[0].is_50
      }
    })
  }
}
