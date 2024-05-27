import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PresencePageComponent } from './presence-page/presence-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { SideMenuComponent } from './side-menu/side-menu.component';
import { SchedulePageComponent } from './schedule-page/schedule-page.component';
import { NewsPageComponent } from './news-page/news-page.component';
import { ProfilePageComponent } from './profile-page/profile-page.component';
import { ChatPageComponent } from './chat-page/chat-page.component';
import { HttpClientModule } from '@angular/common/http'; // Импорт модуля HttpClient
import { TokenInterceptor } from "./token.interceptor"
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthGuard } from './AuthGuard';
import { MaterialiPageComponent } from './materiali-page/materiali-page.component';
import { LoadWorkPageComponent } from './load-work-page/load-work-page.component';
import { IndividualPlanPageComponent } from './individual-plan-page/individual-plan-page.component';
import { StudentsPageComponent } from './students-page/students-page.component'

@NgModule({
  declarations: [
    AppComponent,
    PresencePageComponent,
    LoginPageComponent,
    SideMenuComponent,
    SchedulePageComponent,
    NewsPageComponent,
    ProfilePageComponent,
    ChatPageComponent,
    MaterialiPageComponent,
    LoadWorkPageComponent,
    IndividualPlanPageComponent,
    StudentsPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [ 
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    AuthGuard
  ],
  
  bootstrap: [AppComponent]
})
export class AppModule { }
