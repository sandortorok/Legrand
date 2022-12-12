import { HttpService } from './../../services/http.service';
import { NotificationService, Notification } from './../../services/notification.service';
import { Component, OnInit, ElementRef, OnDestroy } from "@angular/core";
import { ROUTES } from "../sidebar/sidebar.component";
import { Location } from "@angular/common";
import { Router } from "@angular/router";
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.css"]
})
export class NavbarComponent implements OnInit, OnDestroy {
  private listTitles: any[];
  location: Location;
  all_seen = false;
  mobile_menu_visible: any = 0;
  private toggleButton: any;
  private sidebarVisible: boolean;
  public isCollapsed = true;
  closeResult: string;
  public notifications: Notification[] = []
  constructor(
    location: Location,
    private element: ElementRef,
    private router: Router,
    private modalService: NgbModal,
    private notificationService: NotificationService,
    private httpService: HttpService
  ) {
    this.location = location;
    this.sidebarVisible = false;
  }
  // function that adds color white/transparent to the navbar on resize (this is for the collapse)
   updateColor = () => {
   var navbar = document.getElementsByClassName('navbar')[0];
     if (window.innerWidth < 993 && !this.isCollapsed) {
       navbar.classList.add('bg-white');
       navbar.classList.remove('navbar-transparent');
     } else {
       navbar.classList.remove('bg-white');
       navbar.classList.add('navbar-transparent');
     }
   };
   
  ngOnInit() {
    this.notificationService.notificationCast.subscribe(newArr=>{
      this.notifications = newArr
      this.allSeenCheck()
    })
    this.allSeenCheck()
    window.addEventListener("resize", this.updateColor);
    this.listTitles = ROUTES.filter(listTitle => listTitle);
    const navbar: HTMLElement = this.element.nativeElement;
    this.toggleButton = navbar.getElementsByClassName("navbar-toggler")[0];
    this.router.events.subscribe(event => {
      this.sidebarClose();
      var $layer: any = document.getElementsByClassName("close-layer")[0];
      if ($layer) {
        $layer.remove();
        this.mobile_menu_visible = 0;
      }
    });
  }

  collapse() {
    this.isCollapsed = !this.isCollapsed;
    const navbar = document.getElementsByTagName("nav")[0];
    if (!this.isCollapsed) {
      navbar.classList.remove("navbar-transparent");
      navbar.classList.add("bg-white");
    } else {
      navbar.classList.add("navbar-transparent");
      navbar.classList.remove("bg-white");
    }
  }

  sidebarOpen() {
    const toggleButton = this.toggleButton;
    const mainPanel = <HTMLElement>(
      document.getElementsByClassName("main-panel")[0]
    );
    const html = document.getElementsByTagName("html")[0];
    if (window.innerWidth < 991) {
      mainPanel.style.position = "fixed";
    }

    setTimeout(function() {
      toggleButton.classList.add("toggled");
    }, 500);

    html.classList.add("nav-open");

    this.sidebarVisible = true;
  }
  sidebarClose() {
    const html = document.getElementsByTagName("html")[0];
    this.toggleButton.classList.remove("toggled");
    const mainPanel = <HTMLElement>(
      document.getElementsByClassName("main-panel")[0]
    );

    if (window.innerWidth < 991) {
      setTimeout(function() {
        mainPanel.style.position = "";
      }, 500);
    }
    this.sidebarVisible = false;
    html.classList.remove("nav-open");
  }
  sidebarToggle() {
    // const toggleButton = this.toggleButton;
    // const html = document.getElementsByTagName('html')[0];
    var $toggle = document.getElementsByClassName("navbar-toggler")[0];

    if (this.sidebarVisible === false) {
      this.sidebarOpen();
    } else {
      this.sidebarClose();
    }
    const html = document.getElementsByTagName("html")[0];

    if (this.mobile_menu_visible == 1) {
      // $('html').removeClass('nav-open');
      html.classList.remove("nav-open");
      setTimeout(function() {
        $toggle.classList.remove("toggled");
      }, 400);

      this.mobile_menu_visible = 0;
    } else {
      setTimeout(function() {
        $toggle.classList.add("toggled");
      }, 430);

      var $layer = document.createElement("div");
      $layer.setAttribute("class", "close-layer");

      if (html.querySelectorAll(".main-panel")) {
        document.getElementsByClassName("main-panel")[0].appendChild($layer);
      } else if (html.classList.contains("off-canvas-sidebar")) {
        document
          .getElementsByClassName("wrapper-full-page")[0]
          .appendChild($layer);
      }

      setTimeout(function() {
        $layer.classList.add("visible");
      }, 100);
      let mobile_menu_visible = this.mobile_menu_visible
      $layer.onclick = function() {
        //asign a function
        html.classList.remove("nav-open");
        mobile_menu_visible = 0;
        $layer.classList.remove("visible");
        setTimeout(function() {
          $layer.remove();
          $toggle.classList.remove("toggled");
        }, 400);
      }.bind(this);

      html.classList.add("nav-open");
      this.mobile_menu_visible = 1;
    }
  }

  getTitle() {
    var titlee = this.location.prepareExternalUrl(this.location.path());
    if (titlee.charAt(0) === "#") {
      titlee = titlee.slice(1);
    }

    for (var item = 0; item < this.listTitles.length; item++) {
      if (this.listTitles[item].path === titlee) {
        return this.listTitles[item].title;
      }
    }
    return "Dashboard";
  }

  open(content) {
    this.modalService.open(content, {windowClass: 'modal-search'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }
  notificationToggle(is_open){
    console.log('checking', is_open);
    if(!is_open){
      let recently_seen:Notification[] = []
      this.notifications.forEach(n=>{
        n.seen = true;
        recently_seen.push(n)
        this.httpService.seenNotification(n).subscribe(res=>{})
      })
      this.allSeenCheck();
    }
  }
  allSeenCheck(){
    let all_seen = true;
    this.notifications.forEach(n=>{
      if(!n.seen){
        all_seen = false
      }
    })
    this.all_seen = all_seen;
  }
  ngOnDestroy(){
     window.removeEventListener("resize", this.updateColor);
  }
  logOut(){
    localStorage.removeItem('token');
  }
}
