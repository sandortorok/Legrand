import { HttpService } from './../../services/http.service';
import { Component, OnInit } from "@angular/core";
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: "app-dashboard",
  templateUrl: "dashboard.component.html",
  styleUrls: ["dashboard.component.scss"]
})
export class DashboardComponent implements OnInit {
  public canvas : any;
  public ctx;
  public myChartData;
  public amperChartData;
  public clicked: boolean = true;
  public clicked1: boolean = false;
  public clicked2: boolean = false;

  model: NgbDateStruct;
	date: { year: number; month: number };

	public isCollapsed = false;
  constructor() {}
  
  ngOnInit() {
  }
}
