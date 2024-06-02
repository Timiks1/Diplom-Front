import { Component } from '@angular/core';
import { ServerService } from '../Server/server.service';
import { Group } from '../Server/Models/group.model';
import { Review } from '../Server/Models/review.model';
import { Student } from '../Server/Models/Student.model';
@Component({
  selector: 'app-students-page',
  templateUrl: './students-page.component.html',
  styleUrls: ['./students-page.component.css']
})
export class StudentsPageComponent {
  studentGroups: Group[] = [];
  selectedGroup: Group | null = null;
  filteredStudents: Student[] = [];
  allStudents: Student[] = [];

  constructor(private serverService: ServerService) {}

  ngOnInit(): void {
    this.serverService.getStudentsGroups().subscribe(
      (data: any) => {
        this.studentGroups = data.items;
        this.allStudents = this.studentGroups.flatMap(group => group.students);
        this.filteredStudents = [...this.allStudents];
      },
      (error) => {
        console.error('Error fetching student groups:', error);
      }
    );
  }

  onGroupChange(event: any): void {
    const selectedGroupId = event.target.value;
    this.selectedGroup = this.studentGroups.find(group => group.id === selectedGroupId) || null;
    this.filteredStudents = this.selectedGroup ? this.selectedGroup.students : this.allStudents;
  }

  onSearch(event: any): void {
    const searchTerm = event.target.value.toLowerCase();
    this.filteredStudents = this.allStudents.filter(student =>
      `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchTerm)
    );
  }
}
