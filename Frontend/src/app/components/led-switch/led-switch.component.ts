import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
@Component({
  selector: 'app-led-switch',
  templateUrl: './led-switch.component.html',
  styleUrls: ['./led-switch.component.scss']
})
export class LedSwitchComponent implements OnInit {

  constructor() { }
  @Input() is_on:Boolean;
  @Input() zone: Number;

  @Output() switchChangedEvent = new EventEmitter<{zone: Number, is_on: Boolean}>();
  ngOnInit(): void {
  }
  changed(){
    this.is_on = !this.is_on
    this.switchChangedEvent.emit({is_on: this.is_on, zone: this.zone})
  }
}
