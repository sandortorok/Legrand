import { Routes } from "@angular/router";

import { DashboardComponent } from "../../pages/dashboard/dashboard.component";
import { SwitchesComponent } from "../../pages/switches/switches.component";
import { LampsComponent } from "src/app/pages/lamps/lamps.component";
import { MotionsComponent } from "src/app/pages/motions/motions.component";
import { VoltageDashboardComponent } from '../../pages/dashboard/voltage-dashboard/voltage-dashboard.component';
import { PowerFactorComponent } from "src/app/pages/dashboard/power-factor/power-factor.component";
import { ActiveConsumptionComponent } from "src/app/pages/dashboard/active-consumption/active-consumption.component";
import { ActivePowerComponent } from "src/app/pages/dashboard/active-power/active-power.component";
import { ApparentPowerComponent } from "src/app/pages/dashboard/apparent-power/apparent-power.component";
import { ReactivePowerComponent } from "src/app/pages/dashboard/reactive-power/reactive-power.component";
import { CurrentDashboardComponent } from "src/app/pages/dashboard/current-dashboard/current-dashboard.component";
import { ReactiveConsumptionComponent } from "src/app/pages/dashboard/reactive-consumption/reactive-consumption.component";

// import { NotificationsComponent } from "../../pages/notifications/notifications.component";
// import { TypographyComponent } from "../../pages/typography/typography.component";
// import { RtlComponent } from "../../pages/rtl/rtl.component";
// import { IconsComponent } from "../../pages/icons/icons.component";

export const AdminLayoutRoutes: Routes = [
  { path: "dashboard", component: DashboardComponent },
  { path: "switches", component: SwitchesComponent },
  // { path: "notifications", component: NotificationsComponent },
  { path: "lamps", component: LampsComponent },
  { path: "motions", component: MotionsComponent },
  { path: "dashboard/current", component: CurrentDashboardComponent},
  { path: "dashboard/voltage", component: VoltageDashboardComponent},
  { path: "dashboard/activepower", component: ActivePowerComponent},
  { path: "dashboard/reactivepower", component: ReactivePowerComponent},
  { path: "dashboard/apparentpower", component: ApparentPowerComponent},
  { path: "dashboard/powerfactor", component: PowerFactorComponent},
  { path: "dashboard/activeconsumption", component: ActiveConsumptionComponent},
  { path: "dashboard/reactiveconsumption", component: ReactiveConsumptionComponent}
  // { path: "typography", component: TypographyComponent },
  // { path: "icons", component: IconsComponent },
  // { path: "rtl", component: RtlComponent }
];
