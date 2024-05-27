import { Component } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Student } from './Student';
import { SideMenuComponent } from '../side-menu/side-menu.component';
import { ServerService } from '../Server/server.service';
import { LessonResponse } from './LessonReesponse.interface';
@Component({
  selector: 'app-presence-page',
  templateUrl: './presence-page.component.html',
  styleUrls: ['./presence-page.component.css'],
})
export class PresencePageComponent {

  students: Student[] = [];
  studentsSet1: Student[] = [
    { id: 0, photo: "", name: 'Иван Иванов', present: true, grade: 0, attendance: 'present' },
    { id: 1, photo: "", name: 'Мария Петрова', present: true, grade: 0, attendance: 'present' },
    { id: 2, photo: "", name: 'Алексей Алексеев', present: true, grade: 0, attendance: 'present' },
    { id: 3, photo: "", name: 'Екатерина Екатеринова', present: true, grade: 0, attendance: 'present' },
    { id: 4, photo: "", name: 'Сергей Сергеев', present: true, grade: 0, attendance: 'present' },
    { id: 5, photo: "", name: 'Анна Антонова', present: true, grade: 0, attendance: 'present' },
    { id: 6, photo: "", name: 'Дмитрий Дмитриев', present: true, grade: 0, attendance: 'present' },
    { id: 7, photo: "", name: 'Ольга Олегова', present: true, grade: 0, attendance: 'present' }
  ];
  studentsSet2: Student[] = [
    { id: 8, photo: "", name: 'Павел Павлов', present: true, grade: 0, attendance: 'present' },
    { id: 9, photo: "", name: 'Ирина Ириновна', present: true, grade: 0, attendance: 'present' },
    { id: 10, photo: "", name: 'Владимир Владимиров', present: true, grade: 0, attendance: 'present' },
    { id: 11, photo: "", name: 'Татьяна Татьянова', present: true, grade: 0, attendance: 'present' },
    { id: 12, photo: "", name: 'Александр Александров', present: true, grade: 0, attendance: 'present' },
    { id: 13, photo: "", name: 'Людмила Людимилова', present: true, grade: 0, attendance: 'present' },
    { id: 14, photo: "", name: 'Михаил Михайлов', present: true, grade: 0, attendance: 'present' },
    { id: 15, photo: "", name: 'Наталья Натальева', present: true, grade: 0, attendance: 'present' }
  ];
  grades: number[] = Array.from({ length: 100 }, (_, i) => i + 1);
  crystals: number[] = [0, 1, 2, 3, 4, 5];
  today = new Date();
  day = `${this.today.getFullYear()}-${(this.today.getMonth() + 1).toString().padStart(2, '0')}-${this.today.getDate().toString().padStart(2, '0')}`; // Преобразуем дату в формат YYYY-MM-DD
  month = (this.today.getMonth() + 1).toString();
  year = this.today.getFullYear().toString();
  groupName: string = '';
  lessons: LessonResponse[] = [];
  selectedLesson: string = '';

  constructor(private serverService: ServerService){
    
    this.getScheduleForCurrentUserAndDay();

  }
  getScheduleForCurrentUserAndDay(){
    
    this.serverService.getScheduleForCurrentUserAndDay(this.day, this.month, this.year).subscribe(response => {
      this.lessons = response;
      console.log(response);
      if (this.lessons.length > 0) {
        this.sortLessonsByTime();
        this.groupName = this.lessons[0].groupName;
       // Установим первый урок по умолчанию
       
      }
       // Сортируем уроки по времени

    });
  }

  changeAttendance(student: Student, status: 'present' | 'late' | 'absent') {
    student.attendance = status;
  }
  convertTime(time: string): string {
    const timeParts = time.split('.');
    if (timeParts.length === 2) {
      return timeParts[1];
    }
    return time;
  }
  sortLessonsByTime() {
    this.lessons.sort((a, b) => {
      const timeA = this.convertTime(a.time);
      const timeB = this.convertTime(b.time);
      return timeA.localeCompare(timeB);
    });
  }
  updateStudents() {
    // Пример логики для выбора массива студентов в зависимости от выбранного урока
    if (this.selectedLesson === this.lessons[0].time) {
      this.students = this.studentsSet1;
    } else {
      this.students = this.studentsSet2;
    }
  }
  onLessonChange() {
    this.updateStudents();
    console.log(this.selectedLesson) // Обновляем студентов при изменении урока
  }
}
