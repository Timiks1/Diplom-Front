import { Component } from '@angular/core';
import { ServerService } from '../Server/server.service';
import { Group } from '../Server/Models/group.model';
import { Discipline } from '../Server/Models/Discipline.model';
import { Student } from '../Server/Models/Student.model';
import { Lesson, StudentAttendance } from '../Server/Models/lesson.model';
@Component({
  selector: 'app-homework-page',
  templateUrl: './homework-page.component.html',
  styleUrls: ['./homework-page.component.css'],
})
export class HomeworkPageComponent {
  groups: Group[] = [];
  disciplines: Discipline[] = [];
  students: Student[] = [];
  lessons: Lesson[] = [];
  selectedGroup!: Group;
  selectedDiscipline!: Discipline;
  mode: 'classwork' | 'homework' = 'classwork';

  constructor(private serverService: ServerService) {}

  ngOnInit(): void {
    this.serverService.getStudentsGroups().subscribe((groups) => {
      this.groups = groups.items;
      if (this.groups.length > 0) {
        this.selectedGroup = this.groups[0];
        this.onGroupChange();
      }
    });
  }

  onGroupChange(): void {
    if (this.selectedGroup) {
      this.disciplines = this.selectedGroup.disciplines;
      this.students = this.selectedGroup.students;
      if (this.disciplines.length > 0) {
        this.selectedDiscipline = this.disciplines[0];
        this.onDisciplineChange();
      }
    }
  }

  onDisciplineChange(): void {
    if (this.selectedDiscipline) {
      this.serverService
        .getLessonsByDiscipline(this.selectedDiscipline.name)
        .subscribe((response) => {
          this.lessons = response.items;
        });
    }
  }

  switchMode(mode: 'classwork' | 'homework'): void {
    this.mode = mode;
  }

  getStudentGrade(studentId: string, lesson: Lesson): number | string {
    const attendance = lesson.studentAttendances.find(
      (a: StudentAttendance) => a.studentId === studentId
    );
    return attendance ? attendance.grade : '-';
  }

  onGradeInput(event: Event, studentId: string, lesson: Lesson): void {
    const inputElement = event.target as HTMLInputElement;
    const grade = parseInt(inputElement.value, 10);
    this.setStudentGrade(studentId, lesson, grade);
  }

  setStudentGrade(studentId: string, lesson: Lesson, grade: number): void {
    const attendance = lesson.studentAttendances.find(
      (a: StudentAttendance) => a.studentId === studentId
    );
    if (attendance) {
      attendance.grade = grade;
    }
  }
}
