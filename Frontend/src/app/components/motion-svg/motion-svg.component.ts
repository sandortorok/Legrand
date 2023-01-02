import { Motion, MotionService } from './../../services/motion.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-motion-svg',
  templateUrl: './motion-svg.component.html',
  styleUrls: ['./motion-svg.component.scss']
})
export class MotionSVGComponent implements OnInit {
  @ViewChild('Sensors') main: ElementRef;

  constructor(private motionService: MotionService) { }
  ngOnInit(): void {
      
  }
  ngAfterViewInit() {
    this.motionService.motionCast.subscribe(motions=>{
      if(motions.length == 0){
        return;
      }
      motions.forEach(m=>{
        if(m.lastSignal != null){
          let diffTime = new Date().getTime()-new Date(m.lastSignal).getTime();
          const diffMinutes = diffTime / (1000 * 60);
          const maxMinutes = 1
          let percent = diffMinutes / maxMinutes * 100
          if(diffMinutes > maxMinutes) {
            percent = 100
          }
          if(m.is_on){
            percent = 0;
          }
          this.changeMotionColor(m, this.colorCalc(percent))
        }
        else{
          this.changeMotionColor(m, '#777')
        }
      })
    })
  }
  changeMotionColor(motion:Motion, color:String){
    let zones = this.main.nativeElement.children
    for (let z of zones){
      if (z.id == `zone_${motion.zone}_motion`){
        let children = z.children
        for (let c of children){
          console.log(c.classList);
          if(c.classList.contains('motion')){
            let parts = c.children
            for (let p of parts){
              let attributes = p.attributes
              for (let a of attributes){
                if(a.name=='fill'){
                  a.value = color
                }
              }
            }
          }
        }
      }
    }
  }
  colorCalc(percent){
    let gradient = [
      [0, 217, 40, 0],
      [255, 255, 0, 50],
      [119, 119, 119, 100],
    ]
    let chosen1;
    let chosen2;
    gradient.forEach((color,index)=>{
      
      if(percent >= color[3]){
        chosen1 = color
        chosen2 = gradient[index+1]
      }
      if(percent == 100){
        chosen1 = gradient[gradient.length-1];
        chosen2 = gradient[gradient.length-1]
      }
    })
    if(chosen1[3] == chosen2[3]){
      return `rgb(${chosen1[0]}, ${chosen1[1]}, ${chosen1[2]})`
    }
    let diff1 = Math.abs(percent-chosen1[3]);
    let diff2 = Math.abs(percent-chosen2[3]);
    let w2 = diff1/(diff1+diff2)
    let w1 = diff2/(diff1+diff2)
    let rgb = [Math.round(chosen1[0] * w1 + chosen2[0] * w2),
    Math.round(chosen1[1] * w1 + chosen2[1] * w2),
    Math.round(chosen1[2] * w1 + chosen2[2] * w2)];
    return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`

    // linear-gradient(90deg, rgba(0,0,255,1) 0%, rgba(0,255,255,1) 49%, rgba(255,255,0,1) 51%, rgba(255,0,0,1) 100%);
  }
}
