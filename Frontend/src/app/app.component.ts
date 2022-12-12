import { ZoneService } from './services/zone.service';
import { HttpService } from './services/http.service';
import { WebsocketService } from './services/web-socket.service';
import { Component } from "@angular/core";
import 'chartjs-adapter-date-fns';

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  constructor(){
  }
}
