import { Component, OnInit } from '@angular/core';
import { ServerService } from '../Server/server.service';

@Component({
  selector: 'app-schedule-page',
  templateUrl: './schedule-page.component.html',
  styleUrls: ['./schedule-page.component.css'],
})
export class SchedulePageComponent implements OnInit {
  daysInMonth: number[] = [];
  currentMonth: string = '';
  currentYear: number = 0;
  currentDate: Date;
  showPopupFlag: boolean = false;
  selectedDay: number | null = null;
  schedule: any;
  lessonsByDay: { [key: number]: any[] } = {}; // Объект для хранения уроков по дням

  constructor(private serverService: ServerService) {
    this.currentDate = new Date();
    this.updateMonth();
  }

  ngOnInit(): void {
    this.fetchSchedule();
  }

  fetchSchedule(): void {
    const month = (this.currentDate.getMonth() + 1).toString().padStart(2, '0'); // Месяц от 0 до 11, поэтому добавляем 1
    const year = this.currentDate.getFullYear().toString();

    this.serverService.getScheduleForCurrentUser(month, year).subscribe(
      data => {
        this.schedule = data;
        this.processSchedule();
        console.log(this.schedule);
      },
      error => {
        console.error('Error fetching schedule:', error);
      }
    );
  }

  processSchedule(): void {
    this.lessonsByDay = {};
    this.schedule.forEach((lesson: any) => {
      const lessonDate = new Date(lesson.date);
      const day = lessonDate.getDate();
      if (!this.lessonsByDay[day]) {
        this.lessonsByDay[day] = [];
      }
      this.lessonsByDay[day].push(lesson);
    });
  }

  updateMonth(): void {
    this.currentMonth = this.getMonthName(this.currentDate.getMonth());
    this.currentYear = this.currentDate.getFullYear();
    this.daysInMonth = this.getDaysInMonth(this.currentDate);
  }

  nextMonth(): void {
    this.currentDate.setMonth(this.currentDate.getMonth() + 1);
    this.updateMonth();
    this.fetchSchedule();
  }

  previousMonth(): void {
    this.currentDate.setMonth(this.currentDate.getMonth() - 1);
    this.updateMonth();
    this.fetchSchedule();
  }

  showPopup(day: number): void {
    this.selectedDay = day;
    this.showPopupFlag = true;
  }

  hidePopup(): void {
    this.showPopupFlag = false;
    this.selectedDay = null;
  }

  getMonthName(monthIndex: number): string {
    const monthNames = [
      'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
      'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
    ];
    return monthNames[monthIndex];
  }

  getDaysInMonth(date: Date): number[] {
    const daysInMonth = [];
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    for (let i = 1; i <= lastDay; i++) {
      daysInMonth.push(i);
    }
    return daysInMonth;
  }

  hasLessons(day: number): boolean {
    return this.lessonsByDay[day] && this.lessonsByDay[day].length > 0;
  }

  getLessonsForSelectedDay(): any[] {
    return this.selectedDay !== null ? this.lessonsByDay[this.selectedDay] : [];
  }

  formatTime(time: string): string {
    const [ticks, timeString] = time.split('.');
    const [hours, minutes] = timeString.split(':');
    return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
  }
}
