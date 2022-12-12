import { ZoneService } from '../../services/zone.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-lamp-svg',
  templateUrl: './lamp-svg.component.html',
  styleUrls: ['./lamp-svg.component.scss']
})
export class LampSVGComponent implements OnInit {
  constructor(private switchService: ZoneService) {}
  @ViewChild('Lamps') main: ElementRef;
  ngOnInit() {

  }
  ngAfterViewInit() {
    this.switchService.zoneCast.subscribe(zones=>{
      zones.forEach(zone=>{
        if(zone.is_on){
          if(zone.is_50){
            this.changeColorInZone(zone.id, 'blue');
          }
          else{
            this.changeColorInZone(zone.id, '#00d928');
          }
        }
        else{
          this.changeColorInZone(zone.id, '#777');
        }
      })
    })
  }
  changeColorInZone(zone:Number, color:String){
    let zones = this.main.nativeElement.children
    for (let z of zones){
      if (z.id === `zone_${zone}`){
        let children = z.children
        for (let el of children) {
          if(el.classList.contains('lamp')){
            let attributes = el.firstChild.attributes
            for (let a of attributes){
              if(a.name == 'fill'){
                a.value = color
              }
            }
          }
        }
      }
    }
  }
}
