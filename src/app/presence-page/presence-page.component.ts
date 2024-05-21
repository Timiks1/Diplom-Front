import { Component } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Student } from './Student';
import { SideMenuComponent } from '../side-menu/side-menu.component';
@Component({
  selector: 'app-presence-page',
  templateUrl: './presence-page.component.html',
  styleUrls: ['./presence-page.component.css'],
})
export class PresencePageComponent {

  students: Student[] = [
    { id: 0, photo: "",name: 'Иван Иванов', present: false, grade: 0, crystals: 0,  attendance: 'absent' },
    {id: 1, photo: "", name: 'Мария Петрова', present: true, grade: 0, crystals: 0,  attendance: 'present' },
    { id: 2, photo: "",name: 'Иван Иванов', present: false, grade: 0, crystals: 0,  attendance: 'absent' },
    {id: 3, photo: "", name: 'Мария Петрова', present: true, grade: 0, crystals: 0,  attendance: 'present' },
    // Добавьте других студентов здесь
    { id: 4, photo: "",name: 'Иван Иванов', present: false, grade: 0, crystals: 0,  attendance: 'absent' },
    {id: 5, photo: "", name: 'Мария Петрова', present: true, grade: 0, crystals: 0,  attendance: 'present' },
    // Добавьте других студентов здесь
    { id: 6, photo: "",name: 'Иван Иванов', present: false, grade: 0, crystals: 0,  attendance: 'absent' },
    {id: 7, photo: "", name: 'Мария Петрова', present: true, grade: 0, crystals: 0,  attendance: 'present' },
    // Добавьте других студентов здесь
    // Добавьте других студентов здесь
  ];
  grades: number[] = Array.from({ length: 12 }, (_, i) => i + 1);
  crystals: number[] = [0, 1, 2, 3, 4, 5];

  onCrystalChange() {
    let totalCrystals = this.students.reduce((sum, student) => sum + student.crystals, 0);
    if (totalCrystals > 5) {
      // Сбросить значение кристаллов до 0 для всех студентов
      this.students.forEach(student => student.crystals = 0);
    }
  }
  changeAttendance(student: Student, status: 'present' | 'late' | 'absent') {
    student.attendance = status;
  }
}
