import { Component, OnInit } from "@angular/core";

declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
  isCollapsed?: boolean,
  children?: RouteInfo[];
}
export const ROUTES: RouteInfo[] = [
  {
    path: "/dashboard",
    title: "Grafikonok",
    icon: "icon-chart-pie-36",
    class: "",
    children: [
      {
        path: '/current',
        title: "Áramerősség",
        icon: "",
        class: ""
      },
      {
        path: '/voltage',
        title: "Feszültség",
        icon: "",
        class: ""
      },
      {
        path: '/activepower',
        title: "Hatásos teljesítmény",
        icon: "",
        class: ""
      },
      {
        path: '/reactivepower',
        title: "Meddő teljesítmény",
        icon: "",
        class: ""
      },
      {
        path: '/apparentpower',
        title: "Látszólagos teljesítmény",
        icon: "",
        class: ""
      },
      {
        path: '/powerfactor',
        title: "Teljesítmény tényező",
        icon: "",
        class: ""
      },
      {
        path: '/activeconsumption',
        title: "Hatásos fogyasztás",
        icon: "",
        class: ""
      },
      {
        path: '/reactiveconsumption',
        title: "Meddő fogyasztás",
        icon: "",
        class: ""
      },
    ]
  },
  // {
  //   path: "/icons",
  //   title: "Icons",
  //   icon: "icon-atom",
  //   class: ""
  // },
  {
    path: "/switches",
    title: "Kapcsolók",
    icon: "icon-button-power",
    class: ""
  },
  // {
  //   path: "/notifications",
  //   title: "Értesítések",
  //   icon: "icon-bell-55",
  //   class: ""
  // },

  {
    path: "/lamps",
    title: "Lámpák",
    icon: "icon-bulb-63",
    class: ""
  },
  {
    path: "/motions",
    title: "Mozgásérzékelők",
    icon: "icon-wifi",
    class: ""
  }
  // {
  //   path: "/typography",
  //   title: "Typography",
  //   icon: "icon-align-center",
  //   class: ""
  // }
];

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.css"]
})
export class SidebarComponent implements OnInit {
  menuItems: any[];
  constructor() { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
  }
  isMobileMenu() {
    if (window.innerWidth > 991) {
      return false;
    }
    return true;
  }
}
