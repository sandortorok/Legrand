import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-led50-switch',
  templateUrl: './led50-switch.component.html',
  styleUrls: ['./led50-switch.component.scss']
})
export class Led50SwitchComponent implements OnInit {

  constructor() { }
  @Input() is_on:Boolean;
  @Input() zone: Number;

  @Output() switchChangedEvent = new EventEmitter<{zone: Number, is_on:Boolean}>();
  ngOnInit(): void {
  }
  changed(){
    this.is_on = !this.is_on
    this.switchChangedEvent.emit({is_on: this.is_on, zone: this.zone})
  }
}
