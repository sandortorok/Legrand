import { VoltageDashboardComponent } from '../../pages/dashboard/voltage-dashboard/voltage-dashboard.component';
import { PowerFactorComponent } from "src/app/pages/dashboard/power-factor/power-factor.component";
import { ActiveConsumptionComponent } from "src/app/pages/dashboard/active-consumption/active-consumption.component";
import { CurrentDashboardComponent } from './../../pages/dashboard/current-dashboard/current-dashboard.component';
import { ActivePowerComponent } from "src/app/pages/dashboard/active-power/active-power.component";
import { ApparentPowerComponent } from "src/app/pages/dashboard/apparent-power/apparent-power.component";
import { ReactivePowerComponent } from "src/app/pages/dashboard/reactive-power/reactive-power.component";
import { ReactiveConsumptionComponent } from "src/app/pages/dashboard/reactive-consumption/reactive-consumption.component";

import { MotionSVGComponent } from './../../components/motion-svg/motion-svg.component';
import { ToggleButtonComponent } from './../../components/toggle-button/toggle-button.component';
import { LampSVGComponent } from './../../components/lamp-svg/lamp-svg.component';
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { AdminLayoutRoutes } from "./admin-layout.routing";
import { DashboardComponent } from "../../pages/dashboard/dashboard.component";
import { SwitchesComponent } from "../../pages/switches/switches.component";
import { LampsComponent } from "../../pages/lamps/lamps.component";
import { LedSwitchComponent } from './../../components/led-switch/led-switch.component';
import { Led50SwitchComponent } from './../../components/led50-switch/led50-switch.component';
import { NotificationsComponent } from "../../pages/notifications/notifications.component";
import { MotionsComponent } from "../../pages/motions/motions.component";
import { TypographyComponent } from "../../pages/typography/typography.component";
// import { IconsComponent } from "../../pages/icons/icons.component";
// import { RtlComponent } from "../../pages/rtl/rtl.component";
import { NgbCollapseModule, NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ThreeWayChartComponent } from 'src/app/components/three-way-chart/three-way-chart.component';
import { PngSVGComponent } from 'src/app/components/png-svg/png-svg.component';
import { XlsSVGComponent } from 'src/app/components/xls-svg/xls-svg.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    NgbCollapseModule,
    HttpClientModule,
    NgbModule
  ],
  declarations: [
    DashboardComponent,
    CurrentDashboardComponent,
    VoltageDashboardComponent,
    TypographyComponent,
    NotificationsComponent,
    SwitchesComponent,
    LedSwitchComponent,
    Led50SwitchComponent,
    LampsComponent,
    MotionsComponent,
    MotionSVGComponent,
    LampSVGComponent,
    ToggleButtonComponent,
    ThreeWayChartComponent,
    XlsSVGComponent,
    PngSVGComponent,
    ActivePowerComponent,
    ApparentPowerComponent,
    PowerFactorComponent,
    ReactivePowerComponent,
    ActiveConsumptionComponent,
    ReactiveConsumptionComponent
    // IconsComponent,
    // RtlComponent
  ]
})
export class AdminLayoutModule {}
