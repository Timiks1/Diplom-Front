import { Component } from '@angular/core';
import { ServerService } from '../Server/server.service';
import { Syllabus } from './syllabus.interface';
@Component({
  selector: 'app-sylabus-page',
  templateUrl: './sylabus-page.component.html',
  styleUrls: ['./sylabus-page.component.css']
})
export class SylabusPageComponent {
  disciplines: any[] = [];
  selectedDiscipline: any = null;

  syllabus: Syllabus = {
    degree: '',
    educationLevel: '',
    knowledgeArea: '',
    specialty: '',
    opp: '',
    disciplineStatus: '',
    courseAndSemester: '',
    disciplineVolume: '',
    teachingLanguage: '',
    literature: '',
    additionalInfo: '',
    department: '',
    teacherInfo: '',
    prerequisites: '',
    corequisites: '',
    disciplineGoal: '',
    disciplineContent: '',
    individualTasks: '',
    software: '',
    studyResults: '',
    disciplinePolicy: ''
  };

  constructor(private serverService: ServerService) { }

  ngOnInit(): void {
    this.serverService.getTeacherDisciplines().subscribe(
      data => {
        this.disciplines = data;
        this.selectedDiscipline = this.disciplines[0];
      },
      error => {
        console.error('Error fetching disciplines:', error);
      }
    );
  }
  onDisciplineChange(event: any) {
    const selectedDisciplineId = event.target.value;
    this.selectedDiscipline = this.disciplines.find(d => d.id === selectedDisciplineId);
  }

  uploadSyllabus() {
    const fileName = `${this.selectedDiscipline.name}-syllabus_${new Date().toISOString()}`; // Название файла
    this.serverService.uploadSyllabus(this.syllabus, fileName).subscribe(
      response => {
        console.log('Syllabus uploaded successfully:', response);
      },
      error => {
        console.error('Error uploading syllabus:', error);
      }
    );
  }
}
