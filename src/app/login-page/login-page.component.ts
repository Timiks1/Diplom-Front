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
    this.serverService.login(this.username, this.password).subscribe(
      data => {
        this.router.navigate(['/presence']);

      },
      error => {
        console.error('Login failed:', error);
      }
    );
  }
}
