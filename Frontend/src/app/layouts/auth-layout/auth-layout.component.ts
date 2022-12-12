import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTES } from '../../components/sidebar/sidebar.component';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-auth-layout',
  templateUrl: './auth-layout.component.html',
  styleUrls: ['./auth-layout.component.scss']
})
export class AuthLayoutComponent implements OnInit {
  public sidebarColor: string = "red";

  constructor() {}
  changeSidebarColor(color){
    var sidebar = document.getElementsByClassName('sidebar')[0];
    var mainPanel = document.getElementsByClassName('main-panel')[0];

    this.sidebarColor = color;

    if(sidebar != undefined){
        sidebar.setAttribute('data',color);
    }
    if(mainPanel != undefined){
        mainPanel.setAttribute('data',color);
    }
  }
  changeDashboardColor(color){
    var body = document.getElementsByTagName('body')[0];
    if (body && color === 'white-content') {
        body.classList.add(color);
    }
    else if(body.classList.contains('white-content')) {
      body.classList.remove('white-content');
    }
  }
  ngOnInit() {}
}
