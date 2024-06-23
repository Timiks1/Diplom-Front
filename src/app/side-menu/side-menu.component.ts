import { Component } from '@angular/core';
import { ServerService } from '../Server/server.service';
import { Router } from '@angular/router'; // Импортируем Router для перенаправления

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.css'],
})
export class SideMenuComponent {

  constructor(private router: Router, private serverService: ServerService) {}

  logout(): void {
    // Удаляем токен из хранилища
    this.serverService.logout();
    // Перенаправляем на страницу логина
    this.router.navigate(['/login']);
  }
}
