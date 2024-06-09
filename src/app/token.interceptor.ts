import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor() { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Получаем токен из локального хранилища
    const token = (JSON.parse(localStorage.getItem('currentUser') || '{}') as { token: string }).token;

    // Проверяем, что токен существует и добавляем его в заголовок Authorization
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    // Пропускаем запрос дальше
    return next.handle(request);
  }
}
