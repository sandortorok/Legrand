import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-typography",
  templateUrl: "typography.component.html",
  styleUrls: ["typography.component.scss"]
})
export class TypographyComponent implements OnInit {
	displayMonths = 1;
	navigation = 'arrows';
	showWeekNumbers = false;
	outsideDays = 'visible';
  constructor() {}

  ngOnInit() {}
}
