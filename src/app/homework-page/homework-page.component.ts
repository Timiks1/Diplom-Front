import { Component } from '@angular/core';
import { ServerService } from '../Server/server.service';
import { Group } from '../Server/Models/group.model';
import { Discipline } from '../Server/Models/Discipline.model';
import { Student } from '../Server/Models/Student.model';
import { Lesson, StudentAttendance } from '../Server/Models/lesson.model';
import { HomeWork } from '../Server/Models/HomeWork.model';
import { Exam } from '../Server/Models/Exam.model';
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
  homeworks: { [studentId: string]: HomeWork[] } = {};
  exams: { [studentId: string]: any[] } = {}; // Добавляем массив экзаменов для каждого студента
  selectedGroup!: Group;
  selectedDiscipline!: Discipline;
  mode: 'classwork' | 'homework' | 'exams' = 'classwork';
  isAddHomeworkModalOpen: boolean = false;
  newHomework: { description: string; lessonId: string; file?: File } = { description: '', lessonId: '' };
  maxExams: number = 0;
  maxExamsArray: number[] = []; // Добавьте это поле
  isCommentModalOpen: boolean = false;
  newComment: string = '';
  selectedStudentId: string | null = null;
  selectedLesson: Lesson | null = null;
  selectedHomeworkId: string | null = null;

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
  updateMaxExams(): void {
    this.maxExams = Math.max(...Object.values(this.exams).map(exams => exams.length));
    this.maxExamsArray = Array(this.maxExams).fill(0).map((_, i) => i); // Заполняем массив числами от 0 до maxExams-1
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
      this.serverService.getLessonsByDiscipline(this.selectedDiscipline.name).subscribe((response) => {
        this.lessons = response.items;
      });

      this.students.forEach(student => {
        this.serverService.getHomeWorksByStudentId(student.id).subscribe((response) => {
          this.homeworks[student.id] = response.items;
        });
      });

      if (this.mode === 'exams') {
        this.fetchExams();

      }
    }
  }

  fetchExams(): void {
    if (this.selectedDiscipline) {
      this.serverService.getExamsByDiscipline(this.selectedDiscipline.id).subscribe((exams) => {
        this.exams = {};
        exams.forEach((exam: any) => {
          if (!this.exams[exam.studentId]) {
            this.exams[exam.studentId] = [];
          }
          this.exams[exam.studentId].push(exam);
        });

        this.maxExams = Math.max(...Object.values(this.exams).map(examList => examList.length));
        this.updateMaxExams(); // Обновляем максимальное количество экзаменов

      });
    }
  }

  switchMode(mode: 'classwork' | 'homework' | 'exams'): void {
    this.mode = mode;
    if (mode === 'exams') {
      this.fetchExams();
    }
  }

  getStudentGrade(studentId: string, lesson: Lesson): number | string {
    const attendance = lesson.studentAttendances.find(
      (a: StudentAttendance) => a.studentId === studentId
    );
    return attendance ? attendance.grade : '-';
  }

  getStudentHomeworkGrade(studentId: string, lesson: Lesson): number | string {
    if (Array.isArray(this.homeworks[studentId])) {
      const homework = this.homeworks[studentId].find(hw => hw.name === lesson.lessonName);
      return homework ? homework.grade : '-';
    }
    console.error(`homeworks for studentId ${studentId} is not an array:`, this.homeworks[studentId]);
    return '-';
  }

  onGradeInput(event: Event, studentId: string, lesson: Lesson): void {
    const inputElement = event.target as HTMLInputElement;
    const grade = parseInt(inputElement.value, 10);
    this.setStudentGrade(studentId, lesson, grade);
  }

  onHomeworkGradeInput(event: Event, studentId: string, lesson: Lesson): void {
    const inputElement = event.target as HTMLInputElement;
    const grade = parseInt(inputElement.value, 10);
    this.setStudentHomeworkGrade(studentId, lesson, grade);
  }

  setStudentGrade(studentId: string, lesson: Lesson, grade: number): void {
    const attendance = lesson.studentAttendances.find(
      (a: StudentAttendance) => a.studentId === studentId
    );
    if (attendance) {
      attendance.grade = grade;
      this.serverService.updateStudentAttendance(attendance.id, attendance).subscribe(
        (response) => {
          console.log('Student grade updated successfully');
        },
        (error) => {
          console.error('Error updating student grade:', error);
        }
      );
    }
  }

  setStudentHomeworkGrade(studentId: string, lesson: Lesson, grade: number): void {
    if (Array.isArray(this.homeworks[studentId])) {
      const homework = this.homeworks[studentId].find(hw => hw.name === lesson.lessonName);
      if (homework) {
        homework.grade = grade;
        this.serverService.gradeHomework(homework.id, grade).subscribe(
          (response) => {
            console.log('Homework grade updated successfully');
          },
          (error) => {
            console.error('Error updating homework grade:', error);
          }
        );
      }
    } else {
      console.error(`homeworks for studentId ${studentId} is not an array:`, this.homeworks[studentId]);
    }
  }

  downloadHomework(studentId: string, lesson: Lesson): void {
    const homework = this.homeworks[studentId]?.find(hw => hw.name === lesson.lessonName);
    if (homework && homework.file) {
      const byteCharacters = atob(homework.file);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/octet-stream' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${homework.name}.file`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } else {
      console.error('Homework not found or file is missing');
    }
  }

  openAddHomeworkModal(): void {
    this.isAddHomeworkModalOpen = true;
  }

  closeAddHomeworkModal(): void {
    this.isAddHomeworkModalOpen = false;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.newHomework.file = input.files[0];
    }
  }

  onAddHomeworkSubmit(): void {
    const { description, lessonId, file } = this.newHomework;
    if (description && lessonId && file) {
      const reader = new FileReader();
      reader.onload = () => {
        const fileBase64 = reader.result?.toString().split(',')[1];
        if (fileBase64) {
          this.serverService.updateHomeworkByLessonName(this.lessons.find(lesson => lesson.id === lessonId)?.lessonName || lessonId, description, fileBase64).subscribe(
            (response) => {
              console.log('Homework updated successfully');
              this.closeAddHomeworkModal();
              this.onDisciplineChange(); // Refresh the homeworks list
            },
            (error) => {
              console.error('Error updating homework:', error);
            }
          );
        }
      };
      reader.readAsDataURL(file);
    } else {
      console.error('All fields are required');
    }
  }
  
  getExamsForStudent(studentId: string): any[] {
    return this.exams[studentId] || [];
  }

  onExamGradeInput(event: Event, studentId: string, exam: Exam): void {
    const inputElement = event.target as HTMLInputElement;
    const grade = parseInt(inputElement.value, 10);
    exam.grade = grade;  // Обновляем оценку в объекте exam
    this.setStudentExamGrade(exam.id, exam);
  }
  

  setStudentExamGrade(examId: string, exam : Exam): void {
    this.serverService.updateStudentExamGrade(examId, exam).subscribe(
      (response) => {
        console.log('Exam grade updated successfully');
      },
      (error) => {
        console.error('Error updating exam grade:', error);
      }
    );
  }
  getAttendanceClass(studentId: string, lesson: Lesson): string {
    const attendance = lesson.studentAttendances.find((a: StudentAttendance) => a.studentId === studentId);
    if (attendance) {
      if (!attendance.isPresent) {
        return 'absent';
      } else if (attendance.isLate) {
        return 'late';
      } else {
        return 'present';
      }
    }
    return '';
  }
  getHomeworkClass(studentId: string, lesson: Lesson): string {
    const homework = this.homeworks[studentId]?.find(hw => hw.name === lesson.lessonName);
    if (homework) {
      return homework.isChecked ? 'checked' : 'unchecked';
    }
    return '';
  }
  openCommentModal(homeworkId: string): void {
    this.selectedHomeworkId = homeworkId;
    this.isCommentModalOpen = true;
  }

  closeCommentModal(): void {
    this.isCommentModalOpen = false;
    this.newComment = '';
    this.selectedHomeworkId = null;
  }

  submitComment(): void {
    if (this.selectedHomeworkId) {
      this.serverService.addComment(this.selectedHomeworkId, this.newComment).subscribe(
        response => {
          console.log('Comment added successfully:', response);
          this.closeCommentModal();
          // Опционально обновить данные или выполнить дополнительные действия
        },
        error => {
          console.error('Error adding comment:', error);
        }
      );
    }
  }
  
}