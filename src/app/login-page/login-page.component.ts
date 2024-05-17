import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
})
export class LoginPageComponent {
  constructor(private router: Router) {}
  login() {
    // Здесь можете выполнить проверку имени пользователя и пароля
    // Если проверка успешна, выполните перенаправление
    console.log('aaaaa');
    this.router.navigate(['/presence']);
  }
}
