import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { PresencePageComponent } from './presence-page/presence-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { SchedulePageComponent } from './schedule-page/schedule-page.component';
import { NewsPageComponent } from './news-page/news-page.component';
import { ProfilePageComponent } from './profile-page/profile-page.component';
import { ChatPageComponent } from './chat-page/chat-page.component';
import { MaterialiPageComponent } from './materiali-page/materiali-page.component';
import { LoadWorkPageComponent } from './load-work-page/load-work-page.component';
import { IndividualPlanPageComponent } from './individual-plan-page/individual-plan-page.component';
import { SylabusPageComponent } from './sylabus-page/sylabus-page.component';
import { StudentsPageComponent } from './students-page/students-page.component';
import { TestsPageComponent } from './tests-page/tests-page.component';
import { MeetingsPageComponent } from './meetings-page/meetings-page.component';
import { ExchangeVisitsPageComponent } from './exchange-visits-page/exchange-visits-page.component';
import { HomeworkPageComponent } from './homework-page/homework-page.component';
import { AuthGuard } from './AuthGuard'
const routes: Routes = [
  { path: 'login', component: LoginPageComponent }, // Страница входа
  { path: 'presence', component: PresencePageComponent , canActivate: [AuthGuard] }, // Страница присутствия
  { path: 'schedule', component: SchedulePageComponent , canActivate: [AuthGuard] }, // Страница присутствия
  { path: 'news', component: NewsPageComponent , canActivate: [AuthGuard] }, // Страница присутствия
  { path: 'profile', component: ProfilePageComponent, canActivate: [AuthGuard]  }, // Страница присутствия
  { path: 'materiali', component: MaterialiPageComponent, canActivate: [AuthGuard]  }, // Страница присутствия
  { path: 'chat', component: ChatPageComponent, canActivate: [AuthGuard]  }, // Страница присутствия
  { path: 'load-work', component: LoadWorkPageComponent, canActivate: [AuthGuard]  }, // Страница присутствия
  { path: 'individual-plan', component: IndividualPlanPageComponent, canActivate: [AuthGuard]  }, // Страница присутствия
  { path: 'sylabus', component: SylabusPageComponent, canActivate: [AuthGuard]  }, // Страница присутствия
  { path: 'students', component: StudentsPageComponent, canActivate: [AuthGuard]  }, // Страница присутствия
  { path: 'tests', component: TestsPageComponent, canActivate: [AuthGuard]  }, // Страница присутствия
  { path: 'meetings', component: MeetingsPageComponent, canActivate: [AuthGuard]  }, // Страница присутствия
  { path: 'exchange', component: ExchangeVisitsPageComponent, canActivate: [AuthGuard]  }, // Страница присутствия
  { path: 'homework', component: HomeworkPageComponent, canActivate: [AuthGuard]  }, // Страница присутствия
  { path: '**', redirectTo: '/login' }, // Перенаправление на страницу входа при неверном маршруте
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
