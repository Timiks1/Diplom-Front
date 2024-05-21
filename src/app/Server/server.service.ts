import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable,BehaviorSubject  } from 'rxjs';
import { News } from './interfaces'; // Предполагается, что вы импортировали интерфейс News из вашего файла interfaces.ts
import { map } from 'rxjs/operators';
import { User } from './user.interface'; // Импортируем интерфейс User
import { LoginRequestDto, LoginResponseDto } from './LoginInterface';
@Injectable({
  providedIn: 'root'
})
export class ServerService {

  private baseUrl: string = 'https://localhost:7247/api'; // URL вашего сервера

  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('currentUser') || '{}'));
    this.currentUser = this.currentUserSubject.asObservable();
   }
   
   login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/Identity/Login`, { userName: username, password: password })
      .pipe(
        map(response => {
          if (response && response.token) {
            const user = {
              token: response.token,
              expiration: response.expiration
            };
            // Сохраняем пользователя в локальном хранилище
            localStorage.setItem('currentUser', JSON.stringify(user));
            // Устанавливаем пользователя в BehaviorSubject
            this.currentUserSubject.next(user);
          }
         
          return response;
        })
      );
      
  }
  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }
  logout(): void {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }
  // Метод для получения новостей с сервера
  getNews(): Observable<News[]> {
    return this.http.get<any>(`${this.baseUrl}/News`).pipe(
      map(response => response.items as News[])
    );
  }
  getUser(userId: string): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/users/${userId}`);
  }
}