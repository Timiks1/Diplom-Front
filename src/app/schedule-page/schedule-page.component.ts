import { Component } from '@angular/core';

@Component({
  selector: 'app-schedule-page',
  templateUrl: './schedule-page.component.html',
  styleUrls: ['./schedule-page.component.css'],
})
export class SchedulePageComponent {
  daysInMonth: number[] = [];
  currentMonth: string = '';
  currentYear: number = 0;
  currentDate: Date;
  showPopupFlag: boolean = false;
  selectedDay: number | null = null;

  constructor() {
    this.currentDate = new Date();
    this.updateMonth();
  }
  updateMonth(): void {
    this.currentMonth = this.getMonthName(this.currentDate.getMonth());
    this.currentYear = this.currentDate.getFullYear();
    this.daysInMonth = this.getDaysInMonth(this.currentDate);
  }

  nextMonth(): void {
    this.currentDate.setMonth(this.currentDate.getMonth() + 1);
    this.updateMonth();
  }
  previousMonth(): void {
    this.currentDate.setMonth(this.currentDate.getMonth() - 1);
    this.updateMonth();
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
      'Январь',
      'Февраль',
      'Март',
      'Апрель',
      'Май',
      'Июнь',
      'Июль',
      'Август',
      'Сентябрь',
      'Октябрь',
      'Ноябрь',
      'Декабрь',
    ];
    return monthNames[monthIndex];
  }
  getDaysInMonth(date: Date): number[] {
    const daysInMonth = [];
    const lastDay = new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      0
    ).getDate();
    for (let i = 1; i <= lastDay; i++) {
      daysInMonth.push(i);
    }
    return daysInMonth;
  }
}
