import { Component } from '@angular/core';
import { ServerService } from '../Server/server.service';
@Component({
  selector: 'app-zvit-page',
  templateUrl: './zvit-page.component.html',
  styleUrls: ['./zvit-page.component.css']
})
export class ZvitPageComponent {
  disciplines: any[] = [];
  expandedDisciplineId: string | null = null;
  lessons: { [key: string]: any[] } = {};

  constructor(private serverService: ServerService) {}

  ngOnInit(): void {
    this.loadDisciplines();
  }

  loadDisciplines(): void {
    this.serverService.getTeacherDisciplines().subscribe(
      (disciplines: any[]) => {
        this.disciplines = disciplines;
        console.log('Disciplines loaded:', this.disciplines);
      },
      error => {
        console.error('Error fetching disciplines:', error);
      }
    );
  }

  toggleDiscipline(disciplineId: string, disciplineName: string): void {
    if (this.expandedDisciplineId === disciplineId) {
      this.expandedDisciplineId = null;
    } else {
      this.expandedDisciplineId = disciplineId;
      if (!this.lessons[disciplineId]) {
        this.loadLessons(disciplineId, disciplineName);
      }
    }
  }

  loadLessons(disciplineId: string, disciplineName: string): void {
    this.serverService.getLessonsByDiscipline(disciplineName).subscribe(
      response => {
        this.lessons[disciplineId] = this.sortLessonsByDate(response.items);
        console.log(`Lessons loaded for discipline ${disciplineName}:`, this.lessons[disciplineId]);
      },
      error => {
        console.error('Error fetching lessons:', error);
      }
    );
  }

  sortLessonsByDate(lessons: any[]): any[] {
    return lessons.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  getLessonCount(disciplineId: string): number {
    return this.lessons[disciplineId] ? this.lessons[disciplineId].length : 0;
  }
}