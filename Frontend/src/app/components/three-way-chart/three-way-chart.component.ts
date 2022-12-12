import { ExcelService } from './../../services/excel.service';
import { HttpService } from '../../services/http.service';
import { Component, Input, OnInit } from '@angular/core';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import Chart from 'chart.js/auto';

export interface Data{
  type: Number,
  title: String,
  rgb
}

enum timeUnit{
  YEARS = 1,
  YEAR = 2,
  MONTH = 3,
  WEEK = 4,
  DAY = 5,
  TODAY = 6
}
@Component({
  selector: 'app-three-way-chart',
  templateUrl: './three-way-chart.component.html',
  styleUrls: ['./three-way-chart.component.scss']
})
export class ThreeWayChartComponent implements OnInit {
  public canvas : any;
  public ctx;
  public myChartData;

  unit: timeUnit = 6
  
  @Input() chartid:string;
  @Input() endPointName:String;
  
  @Input() title:String = 'title'
  @Input() measureUnit: String = 'kWh'
  
  @Input() rgb1:String = '236,37,13';
  @Input() rgb2:String = '255,255,0';
  @Input() rgb3:String = '247,249,249';
  @Input() rgb4:String = '139,69,19';
  
  @Input() inputData: Data[] = []
  
  latestData: any;
  model: NgbDateStruct = {year:2000, month: 1, day: 1};
	date: { year: number, month: number };
	hour: number;
  constructor(private httpservice: HttpService, private calendar: NgbCalendar, private excelService: ExcelService) { }
  ngOnInit(): void {
    this.model = this.calendar.getToday();
  }

  ngAfterViewInit(): void {
    this.BigChartInit();
    this.update(timeUnit.TODAY);
  }
  BigChartInit(){
    var chart_labels = [];
    this.canvas = document.getElementById(this.chartid);
    this.ctx = this.canvas.getContext("2d");

    let datasets:any[] = []
    this.inputData.forEach(iData=>{
      var gradientStroke = this.ctx.createLinearGradient(0, 230, 0, 50);
      gradientStroke.addColorStop(1, `rgba(${iData.rgb},0.2)`);
      gradientStroke.addColorStop(0.4, `rgba(${iData.rgb},0.0)`);
      gradientStroke.addColorStop(0, `rgba(${iData.rgb},0)`); // colors
      let dataset = {
        label: `${iData.title}`,
        fill: true,
        backgroundColor: gradientStroke,
        borderColor: `rgb(${iData.rgb})`,
        borderWidth: 2,
        borderDash: [],
        borderDashOffset: 0.0,
        pointBackgroundColor: `rgb(${iData.rgb})`,
        pointBorderColor: 'rgba(255,255,255,0)',
        pointHoverBackgroundColor: `rgb(${iData.rgb})`,
        pointBorderWidth: 20,
        pointHoverRadius: 4,
        pointHoverBorderWidth: 15,
        pointRadius: 4,
        data: [],
      }
      datasets.push(dataset)
    })
    const plugin = {
      id: 'customCanvasBackgroundColor',
      beforeDraw: (chart, args, options) => {
        const {ctx} = chart;
        ctx.save();
        ctx.globalCompositeOperation = 'destination-over';
        ctx.fillStyle = options.color || '#99ffff';
        ctx.fillRect(0, 0, chart.width, chart.height);
        ctx.restore();
      }
    };

    var config:any = {
      type: 'line',
      data: {
        labels: chart_labels,
        datasets: datasets
      },
      options: {
        tension: 0.5,
        maintainAspectRatio: false,
        responsive: true,
        plugins:{
          customCanvasBackgroundColor: {
            color: '#27293d',
          },
          legend: {
            display: true,
            position: 'top',
            labels: {
              color: 'white'
            }
          },
          tooltip: {
            // legend: {
            //   display: true
            // },
            callbacks: {
              title: context =>{
                return context[0].dataset.label
              },
              label: item=> `${Math.round(item.parsed.y * 10) / 10} ${this.measureUnit}`
            },
            backgroundColor: '#f5f5f5',
            titleColor: '#000',
            bodyColor: '#666',
            bodySpacing: 4,
            padding: { x: 12, y: 6 },
            intersect: false,
            position: "nearest",
          }
        },
        scales: {
          x:{
            type: 'time',
            time: {
              // parser: timeFormat,
              // round: 'day'
              // tooltipFormat: 'YYYY-MM-DD HH:mm',
              displayFormats: {
                  millisecond: 'HH:mm:ss.SSS',
                  second: 'HH:mm:ss',
                  minute: 'HH:mm',
                  hour: 'H',
                  month: 'yyyy MMMM' //YEAR+MONTH
              }
            },
            grid: {
              drawBorder: false,
              color: `rgba(255,255,255,0.3)`,
              zeroLineColor: "transparent",
            },
            ticks: {
              padding: 10,
              color: "white"
            }
          },
          y: {
            grid: {
              drawBorder: false,
              color: 'rgba(29,140,248,0.0)',
              zeroLineColor: "transparent",
            },
            ticks: {
              padding: 10,
              color: "white"
            }
          },
        }
      },
      plugins: [plugin],
    };
    this.myChartData = new Chart(this.ctx, config);

  }
  updateYears(){
    this.httpservice.getYears(this.endPointName).subscribe(res=>{
      this.latestData = res
      let newDatas:Object = {};
      this.inputData.forEach(iData=>{
        newDatas[`${iData.type}`] = []
      })
      let newLabels:any[] = []
      let allData: number[] = []

      Object.values(res).forEach(el=>{
        this.inputData.forEach(iData=>{
          if(el['type'] == iData.type){
            newDatas[`${iData.type}`].push(el['value'])
            allData.push(el['value'])
          }
        })
        newLabels.push(new Date(el['year'],0,1).getTime())
      })
      this.myChartData.config.options.plugins.tooltip.callbacks.label = (item) =>{
        let d =new Date(item.parsed.x);
        let formattedDate = d.toLocaleString([], {
          year: 'numeric',
        })
        return formattedDate + ': ' + `${Math.round(item.parsed.y * 10) / 10} ${this.measureUnit}`
      }
      this.myChartData.config.options.scales.x.time.unit = 'year'
      
      Object.keys(newDatas).forEach((data, idx)=>{
        this.myChartData.data.datasets[idx].data = newDatas[data];
      })
      this.myChartData.config.options.scales.y.suggestedMax = Math.ceil(Math.max(...allData) * 1.02)
      this.myChartData.data.labels = [...new Set(newLabels)];
      this.myChartData.update();
    })
  }
  updateYear(){
    this.httpservice.getYear(this.endPointName, `${this.model.year}-${this.model.month}-${this.model.day}`).subscribe(res=>{
      this.latestData = res

      let newDatas:Object = {};
      this.inputData.forEach(iData=>{
        newDatas[`${iData.type}`] = []
      })
      let newLabels:any[] = []
      let allData: number[] = []

      Object.values(res).forEach(el=>{
        this.inputData.forEach(iData=>{
          if(el['type'] == iData.type){
            newDatas[`${iData.type}`].push(el['value'])
            allData.push(el['value'])
          }
        })
        newLabels.push(new Date(el['year'], el['month']-1).getTime())
      })
      this.myChartData.config.options.plugins.tooltip.callbacks.label = (item) =>{
        let d =new Date(item.parsed.x);
        let formattedDate = d.toLocaleString([], {
          year: 'numeric',
          month: 'short'
        })
        return formattedDate + ': ' + `${Math.round(item.parsed.y * 10) / 10} ${this.measureUnit}`
      }
      this.myChartData.config.options.scales.x.time.unit = 'month'

      this.myChartData.config.options.scales.y.suggestedMax = Math.ceil(Math.max(...allData) * 1.02)
      this.myChartData.data.datasets.forEach(dataset => {
        dataset.data = []
      });
      Object.keys(newDatas).forEach((data, idx)=>{
        this.myChartData.data.datasets[idx].data = newDatas[data];
      })

      this.myChartData.data.labels = [...new Set(newLabels)];
      this.myChartData.update();
    })
  }
  updateMonth(){
    this.httpservice.getMonth(this.endPointName,`${this.model.year}-${this.model.month}-${this.model.day}`).subscribe(res=>{
      this.latestData = res
      
      let newDatas:Object = {};
      this.inputData.forEach(iData=>{
        newDatas[`${iData.type}`] = []
      })
      let newLabels:any[] = []
      let allData: number[] = []

      Object.values(res).forEach(el=>{
        this.inputData.forEach(iData=>{
          if(el['type'] == iData.type){
            newDatas[`${iData.type}`].push(el['value'])
            allData.push(el['value'])
          }
        })
        newLabels.push(new Date(el['date']).getTime())
      })
      this.myChartData.config.options.plugins.tooltip.callbacks.label = (item) =>{
        let d =new Date(item.parsed.x);
        let formattedDate = d.toLocaleString([], {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })
        return formattedDate + ': ' + `${Math.round(item.parsed.y * 10) / 10} ${this.measureUnit}`
      }
      this.myChartData.config.options.scales.x.time.unit = 'day'
      this.myChartData.config.options.scales.y.suggestedMax = Math.ceil(Math.max(...allData) * 1.02)
      this.myChartData.data.datasets.forEach(dataset => {
        dataset.data = []
      });
      Object.keys(newDatas).forEach((data, idx)=>{
        this.myChartData.data.datasets[idx].data = newDatas[data];
      })

      this.myChartData.data.labels = [...new Set(newLabels)];
      this.myChartData.update();
    })
  }
  updateWeek(){
    this.httpservice.getWeek(this.endPointName,`${this.model.year}-${this.model.month}-${this.model.day}`).subscribe(res=>{
      this.latestData = res

      let newDatas:Object = {};
      this.inputData.forEach(iData=>{
        newDatas[`${iData.type}`] = []
      })
      let newLabels:any[] = []
      let allData: number[] = []

      Object.values(res).forEach(el=>{
        this.inputData.forEach(iData=>{
          if(el['type'] == iData.type){
            newDatas[`${iData.type}`].push(el['value'])
            allData.push(el['value'])
          }
        })
        newLabels.push(new Date(el['date']).getTime())
      })
      this.myChartData.config.options.plugins.tooltip.callbacks.label = (item) =>{
        let d =new Date(item.parsed.x);
        let formattedDate = d.toLocaleString([], {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })
        return formattedDate + ': ' + `${Math.round(item.parsed.y * 10) / 10} ${this.measureUnit}`
      }
      this.myChartData.config.options.scales.x.time.unit = 'day'
      this.myChartData.config.options.scales.y.suggestedMax = Math.ceil(Math.max(...allData) * 1.02)
      this.myChartData.data.datasets.forEach(dataset => {
        dataset.data = []
      });
      Object.keys(newDatas).forEach((data, idx)=>{
        this.myChartData.data.datasets[idx].data = newDatas[data];
      })

      this.myChartData.data.labels = [...new Set(newLabels)];
      this.myChartData.update();
    })
  }
  updateDay(){
    this.httpservice.getDay(this.endPointName, `${this.model.year}-${this.model.month}-${this.model.day}`).subscribe(res=>{
      this.latestData = res

      let newDatas:Object = {};
      this.inputData.forEach(iData=>{
        newDatas[`${iData.type}`] = []
      })
      let newLabels:any[] = []
      let allData: number[] = []

      Object.values(res).forEach(el=>{
        this.inputData.forEach(iData=>{
          if(el['type'] == iData.type){
            newDatas[`${iData.type}`].push(el['value'])
            allData.push(el['value'])
          }
        })
        let date = new Date(el['date']).getTime() + el['hour'] * (60 * 60 * 1000)
        newLabels.push(date)
      })
      this.myChartData.config.options.scales.x.time.unit = 'hour'
      this.myChartData.config.options.plugins.tooltip.callbacks.label = (item) =>{
        let d =new Date(item.parsed.x);
        return `${d.getHours()} óra: ` + `${Math.round(item.parsed.y * 10) / 10} ${this.measureUnit}`
      }
      this.myChartData.data.datasets.forEach(dataset => {
        dataset.data = []
      });
      Object.keys(newDatas).forEach((data, idx)=>{
        this.myChartData.data.datasets[idx].data = newDatas[data];
      })

      this.myChartData.config.options.scales.y.suggestedMax = Math.ceil(Math.max(...allData) * 1.02)
      this.myChartData.data.labels = [...new Set(newLabels)];
      this.myChartData.update();
    })
  }
  updateHour(){
    this.httpservice.getToday(this.endPointName,`${this.model.year}-${this.model.month}-${this.model.day}`, this.hour).subscribe(res=>{
      this.latestData = res

      let newDatas:Object = {};
      this.inputData.forEach(iData=>{
        newDatas[`${iData.type}`] = []
      })
      let newLabels:any[] = []
      let allData: number[] = []

      Object.values(res).forEach(el=>{
        this.inputData.forEach(iData=>{
          if(el['type'] == iData.type){
            newDatas[`${iData.type}`].push(el['value'])
            allData.push(el['value'])
          }
        })
        let date = new Date(el['date']).getTime() + el['hour'] * (60 * 60 * 1000) + el['minute'] * (60 * 1000)
        newLabels.push(date)
      })
      this.myChartData.config.options.scales.x.time.unit = 'minute'
      this.myChartData.config.options.plugins.tooltip.callbacks.label = (item) =>{
        let d =new Date(item.parsed.x);
        return `${this.checkTime(d.getHours())}:${this.checkTime(d.getMinutes())} ` + `${Math.round(item.parsed.y * 10) / 10} ${this.measureUnit}`
      }
      this.myChartData.data.datasets.forEach(dataset => {
        dataset.data = [];
      });
      
      Object.keys(newDatas).forEach((data, idx)=>{
        this.myChartData.data.datasets[idx].data = newDatas[data];
      })

      this.myChartData.config.options.scales.y.suggestedMax = Math.ceil(Math.max(...allData) * 1.02)
      this.myChartData.data.labels = [...new Set(newLabels)];
      this.myChartData.update();
    })
  }
  checkTime(i) {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
  }
  update(unit){
    this.unit = unit
    switch (unit) {
      case timeUnit.YEARS:
        this.updateYears();
        break;
      case timeUnit.YEAR:
        this.updateYear();
        break;
      case timeUnit.MONTH:
        this.updateMonth();
        break;
      case timeUnit.WEEK:
        this.updateWeek();
        break;
      case timeUnit.DAY:
        this.updateDay();
        break;
      case timeUnit.TODAY:
        setTimeout(() => {
          this.hour = new Date().getHours()
          this.updateHour();
        }, 0);
        break;
      default:
        this.updateDay();
    }
  }
  savePng(){
    var a = document.createElement('a');
    console.log(this.myChartData);
    a.href = this.myChartData.toBase64Image();
    a.download = `${this.title}`;
    // Trigger the download
    a.click();
  }
  saveXls() {
    this.latestData.forEach(el => {
      el = this.typeChanger(el)
      if(!el.date){
        return;
      }
      el.date = el.date.split('T')[0]
    });
    this.excelService.exportAsExcelFile(this.latestData, `${this.title}`)
  }
  addHour(){
    if(this.hour == 23) return;
    this.hour++;
    this.updateHour();
  }
  decreaseHour(){
    if(this.hour == 0) return;
    this.hour--;
    this.updateHour();
  }
  hourChanged(e){
    if (Number.isNaN(parseInt(e))){
      return;
    }
    this.updateHour();
  }
  typeChanger(obj){
    switch(obj.type){
      case 20480:
        obj.type = "L1 Fázis áram";
        break;
      case 20482:
        obj.type = "L2 Fázis áram";
        break;
      case 20484:
        obj.type = "L3 Fázis áram";
        break;
      case 20509:
        obj.type = "L1 Fázis feszültség";
        break;
      case 20511:
        obj.type = "L2 Fázis feszültség";
        break;
      case 20513:
        obj.type = "L3 Fázis feszültség";
        break;
      case 20538:
        obj.type = "Háromfázisú összes hatásos teljesítmény";
        break;
      case 20540:
        obj.type = "Háromfázisú összes meddő teljesítmény";
        break;
      case 20544:
        obj.type = "Háromfázisú összes látszólagos teljesítmény";
        break;
      case 20548:
        obj.value = `${obj.value}`
        obj.type = "Háromfázisú teljesítmény tényező";
        break;
      case 20592:
        obj.type = "Pozitív háromfázisú összes hatásos fogyasztás";
        break;
      case 20594:
        obj.type = "Negatív háromfázisú összes hatásos fogyasztás";
        break;
      case 20598:
        obj.type = "Pozitív háromfázisú összes meddő fogyasztás";
        break;
      case 20600:
        obj.type = "Negatív háromfázisú összes meddő fogyasztás";
        break;
      default:
        obj.value = `${obj.value}`
        obj.type = `${obj.type}`
        break;
    }
    obj.value = `${Math.round(obj.value * 100) / 100} ${this.measureUnit}`;
    return obj
  }
}

