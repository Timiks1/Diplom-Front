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
    const expiration = localStorage.getItem('expiration');
    console.log(expiration)
    if (currentUser && currentUser.token && expiration) {
      const expirationDate = new Date(expiration);
      const now = new Date();

      if (expirationDate > now) {
        // Токен действителен, пользователь авторизован
        return true;
      } else {
        // Токен истек, удаляем данные пользователя и перенаправляем на страницу логина
       
        this.serverService.logout();
        this.router.navigate(['/login']);
        return false;
      }
    } else {
      // Пользователь не авторизован, перенаправляем на страницу логина
      this.router.navigate(['/login']);
      return false;
    }
  }
}