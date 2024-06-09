import { Component, Input } from '@angular/core';
import { Student } from '../Server/Models/Student.model';
import { Discipline } from '../Server/Models/Discipline.model';
import { ServerService } from '../Server/server.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Review } from '../Server/Models/review.model';
@Component({
  selector: 'app-student-card',
  templateUrl: './student-card.component.html',
  styleUrls: ['./student-card.component.css']
})
export class StudentCardComponent {
  @Input() student!: Student;
  @Input() disciplines!: Discipline[];
  showModal: boolean = false;
  selectedDiscipline: string = '';
  comment: string = '';
  showReviewModal: boolean = false;
  reviews: Review[] = [];

  constructor(private serverService: ServerService) {
    console.log(this.disciplines)
  }

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  submitReview() {
    const review = {
      id: this.serverService.generateUUID(),
      teacherId: this.serverService.currentUserValue.userId,
      studentId: this.student.id,
      date: new Date().toISOString(),
      discipline: this.selectedDiscipline,
      comment: this.comment
    };

    this.serverService.addReview(review).subscribe(response => {
      console.log('Review submitted successfully', response);
      this.closeModal();
    }, error => {
      console.error('Error submitting review', error);
    });
  }

  openReviewModal(): void {
    this.serverService.getStudentReviews(this.student.id).subscribe(
      (reviews) => {
        this.reviews = reviews;
        this.showReviewModal = true;
      },
      (error) => {
        console.error('Error fetching reviews:', error);
      }
    );
  }

  closeReviewModal(): void {
    this.showReviewModal = false;
    this.reviews = [];
  }
}