import { Component } from '@angular/core';
import { ServerService } from '../Server/server.service';
import { Group } from '../Server/Models/group.model';
import { Review } from '../Server/Models/review.model';
import { Student } from '../Server/Models/student.model';
@Component({
  selector: 'app-students-page',
  templateUrl: './students-page.component.html',
  styleUrls: ['./students-page.component.css']
})
export class StudentsPageComponent {
  groups: Group[] = [];
  students: Student[] = [];
  selectedGroup: string = '';
  selectedStudent: Student | null = null;
  review: Review = { teacherId: '', studentId: '', comment: '', discipline: '' };

  constructor(private serverService: ServerService) {}

  ngOnInit(): void {
    this.getGroups();
  }

  getGroups(): void {
    this.serverService.getGroups().subscribe(groups => {
      this.groups = groups;
    });
  }

  onGroupChange(): void {
    this.serverService.getStudentsByGroup(this.selectedGroup).subscribe(students => {
      this.students = students;
    });
  }

  onStudentClick(student: Student): void {
    this.selectedStudent = student;
    this.review.studentId = student.id;
  }

  onCloseModal(): void {
    this.selectedStudent = null;
  }

  onSubmitReview(): void {
    this.review.teacherId = this.serverService.currentUserValue.userId;
    this.serverService.addReview(this.review).subscribe(response => {
      console.log('Review submitted:', response);
      this.onCloseModal();
    }, error => {
      console.error('Error submitting review:', error);
    });
  }
}
