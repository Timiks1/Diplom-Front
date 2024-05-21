import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ServerService } from "./Server/server.service"

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private serverService: ServerService, private router: Router) { }

  canActivate(): boolean {
    const currentUser = this.serverService.currentUserValue;
    if (currentUser && currentUser.token) {
      // Если пользователь авторизован, возвращаем true
      return true;
    } else {
      // Если пользователь не авторизован, перенаправляем на страницу логина
      this.router.navigate(['/login']);
      return false;
    }
  }
}
