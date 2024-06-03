import { Component } from '@angular/core';
import { ServerService } from '../Server/server.service';
import { Group } from '../Server/Models/group.model';
import { Discipline } from '../Server/Models/Discipline.model';
import { Student } from '../Server/Models/Student.model';
import { Lesson, StudentAttendance } from '../Server/Models/lesson.model';
import { HomeWork } from '../Server/Models/HomeWork.model';
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
  selectedGroup!: Group;
  selectedDiscipline!: Discipline;
  mode: 'classwork' | 'homework' = 'classwork';
  isAddHomeworkModalOpen: boolean = false;
  newHomework: { description: string; lessonId: string; file?: File } = { description: '', lessonId: '' };

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
      this.serverService.getLessonsByDiscipline(this.selectedDiscipline.name).subscribe((response) => {
        this.lessons = response.items;
      });

      this.students.forEach(student => {
        this.serverService.getHomeWorksByStudentId(student.id).subscribe((response) => {
          this.homeworks[student.id] = response.items;
        });
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
                this.students.forEach(student => {
                    const homework: HomeWork = {
                        id: this.serverService.generateUUID(),
                        name: this.lessons.find(lesson => lesson.id === lessonId)?.lessonName || lessonId,
                        description,
                        studentName: `${student.firstName} ${student.lastName}`,
                        teacherName: this.serverService.currentUserValue.userName,
                        disciplineName: this.selectedDiscipline.name,
                        file: fileBase64,
                        isChecked: false,
                        grade: 0,
                        studentId: student.id,
                        disciplineId: this.selectedDiscipline.id,
                        teacherId: this.serverService.currentUserValue.userId,
                    };

                    this.serverService.addHomework(homework).subscribe(
                        (response) => {
                            console.log('Homework added successfully for student:', student.id);
                        },
                        (error) => {
                            console.error('Error adding homework for student:', student.id, error);
                        }
                    );
                });

                this.closeAddHomeworkModal();
                this.onDisciplineChange(); // Refresh the homeworks list
            }
        };
        reader.readAsDataURL(file);
    } else {
        console.error('All fields are required');
    }
}

}