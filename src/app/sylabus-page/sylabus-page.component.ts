import { Component } from '@angular/core';
import { ServerService } from '../Server/server.service';
import { Syllabus } from './syllabus.interface';
import { saveAs } from 'file-saver'; // Импортируйте библиотеку file-saver для сохранения файла на клиенте
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';

@Component({
  selector: 'app-sylabus-page',
  templateUrl: './sylabus-page.component.html',
  styleUrls: ['./sylabus-page.component.css']
})
export class SylabusPageComponent {
  disciplines: any[] = [];
  selectedDiscipline: any = null;

  syllabus: Syllabus = {
    literature: '',
    additionalInfo: '',
    teacherInfo: '',
    prerequisites: '',
    corequisites: '',
    disciplineGoal: '',
    disciplineContent: '',
    individualTasks: '',
    software: '',
    studyResults: '',
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
    if (!this.selectedDiscipline) {
      console.error('No discipline selected');
      return;
    }

    const disciplineId = this.selectedDiscipline.id;

    this.serverService.generateSyllabus(disciplineId).subscribe(
      (response) => {
        const { file, fileName, syllabusId } = response;
        console.log('Template generated successfully');

        // Создание объекта данных для отправки на сервер
        const syllabusData = {
          literature: this.syllabus.literature,
          additionalInfo: this.syllabus.additionalInfo,
          teacherInfo: this.syllabus.teacherInfo,
          prerequisites: this.syllabus.prerequisites,
          corequisites: this.syllabus.corequisites,
          disciplineGoal: this.syllabus.disciplineGoal,
          disciplineContent: this.syllabus.disciplineContent,
          individualTasks: this.syllabus.individualTasks,
          software: this.syllabus.software,
          studyResults: this.syllabus.studyResults,
        };

        // Отправка данных на сервер для обновления силлабуса
        this.serverService.updateSyllabusWithData(syllabusId, syllabusData).subscribe(
          response => {
            console.log('Syllabus updated successfully with data:', response);
          },
          error => {
            console.error('Error updating syllabus with data:', error);
          }
        );
      },
      error => {
        console.error('Error generating template:', error);
      }
    );
  }
}
