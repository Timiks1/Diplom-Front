import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ServerService } from '../Server/server.service';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
})
export class LoginPageComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private serverService: ServerService, private router: Router) { }

  
  login(): void {
    this.serverService.login(this.username.trim(), this.password.trim())
      .subscribe(
        response => {
          if (response && response.token) {
            // Переход на следующую страницу (например, '/presense')
            this.router.navigate(['/presence']);
          } else {
            console.error('Invalid response:', response);
            // Добавьте обработку некорректного ответа здесь, если необходимо
          }
        },
        error => {
          console.error('Error occurred:', error); // Обработка ошибки
        }
      );
  }
}
