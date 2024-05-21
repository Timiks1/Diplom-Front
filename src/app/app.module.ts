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
import { AuthGuard } from './AuthGuard'

@NgModule({
  declarations: [
    AppComponent,
    PresencePageComponent,
    LoginPageComponent,
    SideMenuComponent,
    SchedulePageComponent,
    NewsPageComponent,
    ProfilePageComponent,
    ChatPageComponent
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
