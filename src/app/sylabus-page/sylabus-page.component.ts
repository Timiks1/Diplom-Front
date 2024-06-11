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
    const fileName = `${this.selectedDiscipline.name}-syllabus_${new Date().toISOString()}`; // Название файла

    // Генерация шаблона силлабуса
    this.serverService.generateSyllabus(disciplineId).subscribe(
      (template: Blob) => {
        console.log('Template generated successfully');

        // Заполнение шаблона данными
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target?.result;
          if (content) {
            const zip = new PizZip(content as ArrayBuffer);
            const doc = new Docxtemplater(zip, {
              paragraphLoop: true,
              linebreaks: true,
            });
          
          // Заполнение шаблона данными из полей ввода
          doc.setData({
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
          });

          try {
            doc.render();
          } catch (error) {
            console.error('Error rendering document:', error);
            return;
          }

          const out = doc.getZip().generate({
            type: 'blob',
            mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          });

          // Загрузка заполненного файла на сервер
          this.serverService.uploadSyllabusFile(out,  fileName).subscribe(
            response => {
              console.log('Syllabus uploaded successfully:', response);
            },
            error => {
              console.error('Error uploading syllabus:', error);
            }
          );
        } else {
          console.error('Error reading template content');
        }
        };
        reader.readAsArrayBuffer(template);
      },
      error => {
        console.error('Error generating template:', error);
      }
    );
  }
}
