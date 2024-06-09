import { Component, OnInit } from '@angular/core';
import { ServerService } from '../Server/server.service';

@Component({
  selector: 'app-materiali-page',
  templateUrl: './materiali-page.component.html',
  styleUrls: ['./materiali-page.component.css']
})
export class MaterialiPageComponent implements OnInit {
  disciplines: any[] = [];
  selectedDiscipline: any = null;
  lessons: any[] = [];
  lessonMaterials: { [key: string]: any[] } = {};
  expandedLessonId: string | null = null;
  isAddMaterialModalOpen: boolean = false;
  newMaterial: { name: string; file?: File; lessonId: string; fileFormat: string } = { name: '', lessonId: '', fileFormat: '' };

  constructor(private serverService: ServerService) {}

  ngOnInit(): void {
    this.loadDisciplines();
  }

  loadDisciplines(): void {
    this.serverService.getTeacherDisciplines().subscribe(
      (disciplines: any[]) => {
        this.disciplines = disciplines;
        this.selectedDiscipline = this.disciplines[0];
        this.loadLessons(this.selectedDiscipline.name);
        console.log('Disciplines loaded:', this.disciplines);
      },
      error => {
        console.error('Error fetching disciplines:', error);
      }
    );
  }

  onDisciplineChange(event: any): void {
    const disciplineId = event.target.value;
    this.selectedDiscipline = this.disciplines.find(d => d.id === disciplineId);
    console.log('Selected discipline:', this.selectedDiscipline);
    this.loadLessons(this.selectedDiscipline.name);
  }

  loadLessons(disciplineName: string): void {
    this.serverService.getLessonsByDiscipline(disciplineName).subscribe(
      response => {
        this.lessons = response.items;
        console.log('Lessons loaded for discipline', disciplineName, ':', this.lessons);
      },
      error => {
        console.error('Error fetching lessons:', error);
      }
    );
  }

  toggleMaterials(lessonId: string): void {
    if (this.expandedLessonId === lessonId) {
      this.expandedLessonId = null;
    } else {
      this.expandedLessonId = lessonId;
      this.loadMaterials(lessonId);
    }
  }

  loadMaterials(lessonId: string): void {
    this.serverService.getWorkingCurriculumsByLessonId(lessonId).subscribe(
      response => {
        this.lessonMaterials[lessonId] = response.items;
        console.log('Materials loaded for lesson', lessonId, ':', this.lessonMaterials[lessonId]);
      },
      error => {
        console.error('Error fetching materials:', error);
      }
    );
  }

  addMaterial(lessonId: string): void {
    this.newMaterial.lessonId = lessonId;
    this.isAddMaterialModalOpen = true;
  }

  closeAddMaterialModal(): void {
    this.isAddMaterialModalOpen = false;
    this.newMaterial = { name: '', lessonId: '', fileFormat: '' };
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.newMaterial.file = input.files[0];
      this.newMaterial.fileFormat = input.files[0].name.split('.').pop() || '';
    }
  }

  onAddMaterialSubmit(): void {
    if (this.newMaterial.name && this.newMaterial.file && this.newMaterial.fileFormat) {
      const reader = new FileReader();
      reader.onload = () => {
        const fileBase64 = reader.result?.toString().split(',')[1];
        if (fileBase64) {
          const material = {
            id: this.serverService.generateUUID(),
            teacherId: this.serverService.currentUserValue.userId,
            name: this.newMaterial.name,
            lessonId: this.newMaterial.lessonId,
            fileFormat: this.newMaterial.fileFormat,
            file: fileBase64,
          };

          this.serverService.addMaterial(material).subscribe(
            response => {
              console.log('Material added successfully:', response);
              this.loadMaterials(this.newMaterial.lessonId); // Refresh materials list
              this.closeAddMaterialModal();
            },
            error => {
              console.error('Error adding material:', error);
            }
          );
        }
      };
      reader.readAsDataURL(this.newMaterial.file);
    } else {
      console.error('All fields are required');
    }
  }

  downloadMaterial(base64File: string, fileFormat: string, fileName: string): void {
    const byteCharacters = atob(base64File);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: this.getFileMimeType(fileFormat) });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}.${fileFormat}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  private getFileMimeType(fileFormat: string): string {
    const mimeTypes: { [key: string]: string } = {
      'pdf': 'application/pdf',
      'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      // Добавьте другие форматы по необходимости
    };
    return mimeTypes[fileFormat] || 'application/octet-stream';
  }
}