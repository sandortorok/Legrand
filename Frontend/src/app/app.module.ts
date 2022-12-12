import { WebsocketService } from './services/web-socket.service';
import { NotificationService } from './services/notification.service';
import { ExcelService } from './services/excel.service';
import { ZoneService } from './services/zone.service';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";
import { FormsModule, NG_VALIDATORS, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { ToastrModule } from 'ngx-toastr';

import { AppComponent } from "./app.component";
import { AdminLayoutComponent } from "./layouts/admin-layout/admin-layout.component";
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { AppRoutingModule } from "./app-routing.module";
import { ComponentsModule } from "./components/components.module";
import { SanitizeHtmlPipe } from './pipes/sanitize-html.pipe';
import { LoginComponent } from './pages/login/login.component';
import { TokenInterceptor } from './interceptors/token-interceptor';
import { ForbiddenValidatorDirective } from './validators/forbidden-name.directive';


@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ComponentsModule,
    NgbModule,
    RouterModule,
    AppRoutingModule,
    ToastrModule.forRoot()
  ],
  declarations: [AppComponent, AdminLayoutComponent, AuthLayoutComponent, SanitizeHtmlPipe, LoginComponent, ForbiddenValidatorDirective],
  providers: [ExcelService, NotificationService, WebsocketService, ZoneService,
     { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
      { provide: NG_VALIDATORS, useExisting: ForbiddenValidatorDirective, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
