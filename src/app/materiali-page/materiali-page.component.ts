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
  materials: any[] = [];

  // Заглушка для уроков
  lessonsPlaceholder: any[] = [
    { id: '1', disciplineId: '1', name: 'Урок 1: Введение в алгоритмы' },
    { id: '2', disciplineId: '1', name: 'Урок 2: Сортировка' },
    { id: '3', disciplineId: '2', name: 'Урок 1: Сложность алгоритмов' },
    { id: '4', disciplineId: '2', name: 'Урок 2: Анализ производительности' },
    { id: '5', disciplineId: '3', name: 'Урок 1: Стеки' },
    { id: '6', disciplineId: '3', name: 'Урок 2: Очереди' }
  ];

  constructor(private serverService: ServerService) {}

  ngOnInit(): void {
    this.loadDisciplines();
  }

  loadDisciplines(): void {
    this.serverService.getTeacherDisciplines().subscribe(
      (disciplines: any[]) => {
        this.disciplines = disciplines;
        this.selectedDiscipline = this.disciplines[0];
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
    this.loadLessons(disciplineId);
  }

  loadLessons(disciplineId: string): void {
    this.lessons = this.lessonsPlaceholder.filter(lesson => lesson.disciplineId === disciplineId);
    console.log('Lessons loaded for discipline', disciplineId, ':', this.lessons);
  }

  addMaterial(lessonId: string): void {
    // Логика для добавления материала к уроку
    console.log('Adding material to lesson:', lessonId);
  }
}
