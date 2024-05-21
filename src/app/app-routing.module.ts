import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { PresencePageComponent } from './presence-page/presence-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { SchedulePageComponent } from './schedule-page/schedule-page.component';
import { NewsPageComponent } from './news-page/news-page.component';
import { ProfilePageComponent } from './profile-page/profile-page.component';
import { ChatPageComponent } from './chat-page/chat-page.component';
import { AuthGuard } from './AuthGuard'
const routes: Routes = [
  { path: 'login', component: LoginPageComponent }, // Страница входа
  { path: 'presence', component: PresencePageComponent , canActivate: [AuthGuard] }, // Страница присутствия
  { path: 'schedule', component: SchedulePageComponent , canActivate: [AuthGuard] }, // Страница присутствия
  { path: 'news', component: NewsPageComponent , canActivate: [AuthGuard] }, // Страница присутствия
  { path: 'profile', component: ProfilePageComponent, canActivate: [AuthGuard]  }, // Страница присутствия
  { path: 'chat', component: ChatPageComponent, canActivate: [AuthGuard]  }, // Страница присутствия

  { path: '**', redirectTo: '/login' }, // Перенаправление на страницу входа при неверном маршруте
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
