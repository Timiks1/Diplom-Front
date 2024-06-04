import { Component } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Student } from '../Server/Models/Student.model';
import { SideMenuComponent } from '../side-menu/side-menu.component';
import { ServerService } from '../Server/server.service';
import { LessonResponse } from './LessonReesponse.interface';
import { forkJoin } from 'rxjs';
import { Group } from '../Server/Models/group.model';
import { v4 as uuidv4 } from 'uuid';
import { StudentAttendance,Lesson } from '../Server/Models/lesson.model';
@Component({
  selector: 'app-presence-page',
  templateUrl: './presence-page.component.html',
  styleUrls: ['./presence-page.component.css'],
})
export class PresencePageComponent {
  students: Student[] = [];
  grades: number[] = Array.from({ length: 100 }, (_, i) => i + 1);
  today = new Date();
  day = `${this.today.getFullYear()}-${(this.today.getMonth() + 1).toString().padStart(2, '0')}-${this.today.getDate().toString().padStart(2, '0')}`; // Преобразуем дату в формат YYYY-MM-DD
  month = (this.today.getMonth() + 1).toString();
  year = this.today.getFullYear().toString();
  groupName: string = '';
  lessons: LessonResponse[] = [];
  selectedLesson: LessonResponse | null = null;
  groups: Group[] = []; // Массив для хранения данных групп
  selectedGroup?: Group;
  studentAttendances: StudentAttendance[] = [];
  lessonDetails: Lesson | null = null; // Переменная для сохранения деталей урока
  isModalOpen = false; // Переменная для управления состоянием модального окна
  homeworkDescription = ''; // Поле для описания домашнего задания
  selectedFile: File | null = null; // Поле для выбранного файла

  constructor(private serverService: ServerService) {
    this.getScheduleForCurrentUserAndDay();
  }

  getScheduleForCurrentUserAndDay() {
    this.serverService.getScheduleForCurrentUserAndDay(this.day, this.month, this.year).subscribe(response => {
      this.lessons = response;
      console.log(response);

      const groupRequests = this.lessons.map(lesson => this.serverService.getGroupById(lesson.studentGroupId));

      forkJoin(groupRequests).subscribe((groupResponses) => {
        this.groups = groupResponses.map(groupResponse => groupResponse.item);
        console.log('Groups data:', this.groups);
      }, error => {
        console.error('Error fetching groups data:', error);
      });

      if (this.lessons.length > 0) {
        this.sortLessonsByTime();
        this.groupName = this.lessons[0].groupName;
        // Установим первый урок по умолчанию
      }
      // Сортируем уроки по времени
    });
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

  onLessonChange(event: any) {
    const lessonId = event.target.value;
    this.selectedLesson = this.lessons.find(lesson => lesson.lesson === lessonId) || null;
    console.log('Selected lesson:', this.selectedLesson);
    if (this.selectedLesson) {
      this.selectedGroup = this.groups.find(gr => gr.id === this.selectedLesson?.studentGroupId);
      if (this.selectedGroup) {
        this.students = this.selectedGroup.students;
        this.createStudentAttendances();
        this.createLessonDetails(); // Создание деталей нового урока
      }
    }
  }

  createStudentAttendances() {
    this.studentAttendances = this.students.map(student => ({
      id: uuidv4(), 
      studentId: student.id,
      isPresent: false,
      isLate: false,
      grade: 0,
      lessonId: this.selectedLesson?.lessonId || ''
    }));
  }
  createLessonDetails() {
    if (this.selectedLesson) {
      this.lessonDetails = {
        id: uuidv4(),
        date: new Date().toISOString(), // Или используйте другую дату, если нужно
        subjectName: this.selectedLesson.description,
        lessonName: this.selectedLesson.lesson,
        teacherId: this.serverService.currentUserValue.userId,
        homeWorkId: null,
        studentAttendances: this.studentAttendances
      };
    }
  }

  changeAttendance(student: Student, status: 'present' | 'late' | 'absent') {
    const attendance = this.studentAttendances.find(sa => sa.studentId === student.id);
    if (attendance) {
      if (status === 'present') {
        attendance.isPresent = true;
        attendance.isLate = false;
      } else if (status === 'late') {
        attendance.isPresent = true;
        attendance.isLate = true;
      } else if (status === 'absent') {
        attendance.isPresent = false;
        attendance.isLate = false;
      }
    }
    console.log('Updated attendances:', this.studentAttendances);
  }

  getAttendanceStatus(student: Student): StudentAttendance {
    return this.studentAttendances.find(sa => sa.studentId === student.id) || { isPresent: false, isLate: false, grade: 0, studentId: student.id, lessonId: this.selectedLesson?.lessonId || '', id: uuidv4() };
  }

  onGradeChange(student: Student) {
    const attendance = this.studentAttendances.find(sa => sa.studentId === student.id);
    if (attendance) {
      attendance.grade = this.getAttendanceStatus(student).grade;
    }
    console.log('Updated attendances:', this.studentAttendances);
  }

  saveLessonDetails() {
    if (this.lessonDetails) {
      this.lessonDetails.studentAttendances = this.studentAttendances;
      console.log(this.lessonDetails);
      this.serverService.createLesson(this.lessonDetails).subscribe(response => {
        console.log('Lesson details saved successfully');
      }, error => {
        console.error('Error saving lesson details:', error);
      });
    }
  }
  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  onFileChange(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onAddHomeworkSubmit() {
    if (this.lessonDetails && this.selectedFile) {
      this.lessonDetails.homeWorkId = this.selectedFile.name;
      // Загрузите файл на сервер или выполните необходимые действия
      console.log('Homework Description:', this.homeworkDescription);
      console.log('Selected File:', this.selectedFile);
      this.saveLessonDetails();
      this.closeModal();
    }
  }


}
