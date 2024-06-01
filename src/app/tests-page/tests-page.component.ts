import { Component } from '@angular/core';
import { ServerService } from '../Server/server.service';
import { TeacherTest } from '../Server/interfaces';
@Component({
  selector: 'app-tests-page',
  templateUrl: './tests-page.component.html',
  styleUrls: ['./tests-page.component.css']
})
export class TestsPageComponent {
  teacherTests: TeacherTest[] = [];
  filteredTests: TeacherTest[] = [];
  selectedStatus: string = 'В ожидании'; // Значение по умолчанию

  // Для модального окна
  isModalOpen: boolean = false;
  isEditMode: boolean = false;
  editTestId: string | null = null;
  newTest = {
    testTheme: '',
    testUrl: '',
    group: ''
  };

  constructor(private serverService: ServerService) {}

  ngOnInit(): void {
    this.serverService.getTeacherTests().subscribe(
      tests => {
        this.teacherTests = tests;
        this.filterTests(); // Фильтруем тесты при загрузке
      },
      error => {
        console.error('Error fetching teacher tests:', error);
      }
    );
  }

  onStatusChange(event: any): void {
    this.selectedStatus = event.target.value;
    this.filterTests(); // Фильтруем тесты при изменении статуса
  }

  filterTests(): void {
    if (this.selectedStatus === 'В ожидании') {
      this.filteredTests = this.teacherTests.filter(test => test.status === 'waiting');
    } else if (this.selectedStatus === 'Принятые') {
      this.filteredTests = this.teacherTests.filter(test => test.status === 'ok');
    } else if (this.selectedStatus === 'Отклоненные') {
      this.filteredTests = this.teacherTests.filter(test => test.status === 'denied');
    } else {
      this.filteredTests = this.teacherTests; // Показываем все тесты, если выбран неизвестный статус
    }
  }

  addTest(): void {
    this.isModalOpen = true;
    this.isEditMode = false;
    this.newTest = { testTheme: '', testUrl: '', group: '' };
  }

  editTest(test: TeacherTest): void {
    this.isModalOpen = true;
    this.isEditMode = true;
    this.editTestId = test.id;
    this.newTest = { testTheme: test.testTheme, testUrl: test.testUrl, group: '' }; // Assuming group is not part of the test object
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  submitTest(): void {
    if (this.isEditMode && this.editTestId) {
      // Логика для редактирования теста
      const updatedTest: TeacherTest = {
        id: this.editTestId,
        teacherId: this.serverService.currentUserValue.userId, // Используем currentUserValue из сервиса
        status: 'waiting', // assuming status remains waiting
        testTheme: this.newTest.testTheme,
        testUrl: this.newTest.testUrl
      };
      this.serverService.updateTeacherTest(updatedTest).subscribe(
        response => {
          console.log('Test updated successfully:', response);
          this.loadTests();
        },
        error => {
          console.error('Error updating test:', error);
        }
      );
    } else {
      // Логика для добавления нового теста
      const { testTheme, testUrl, group } = this.newTest;
      this.serverService.addTeacherTest(testTheme, testUrl, group).subscribe(
        response => {
          console.log('Test added successfully:', response);
          this.loadTests();
        },
        error => {
          console.error('Error adding test:', error);
        }
      );
    }

    this.closeModal();
  }

  loadTests(): void {
    this.serverService.getTeacherTests().subscribe(
      tests => {
        this.teacherTests = tests;
        this.filterTests();
      },
      error => {
        console.error('Error fetching teacher tests:', error);
      }
    );
  }
}
