import { Component } from '@angular/core';

@Component({
  selector: 'app-news-page',
  templateUrl: './news-page.component.html',
  styleUrls: ['./news-page.component.css'],
})
export class NewsPageComponent {
  selectedCategory: string = 'educational'; // Изначально выбранная категория
  newsRows: string[][] = [[]]; // Массив для хранения новостей в виде рядов

  constructor() {
    // При инициализации компонента добавляем 8 прямоугольников в массив новостей
  }

  loadNews(category: string): void {
    // Устанавливаем новую выбранную категорию
    this.selectedCategory = category;
  }
}
