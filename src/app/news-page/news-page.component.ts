import { Component } from '@angular/core';
import { ServerService } from '../Server/server.service';
import { News} from '../Server/interfaces';
@Component({
  selector: 'app-news-page',
  templateUrl: './news-page.component.html',
  styleUrls: ['./news-page.component.css'],
})
export class NewsPageComponent {
  selectedCategory: string = 'educational'; // Изначально выбранная категория
  newsList: News[] = [];
  showFromDepartmentOnly: boolean = false;

  constructor(private serverService: ServerService) {
    this.GetNews();
  }
  GetNews() : void {
    this.serverService.getNews().subscribe((news: News[]) => {
      
      this.newsList = news.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    });
   
  }
  ChooseNews(category: string): void {
    // Устанавливаем новую выбранную категорию
    if(category == "educational"){
      this.showFromDepartmentOnly = false;
    }
    else{
      this.showFromDepartmentOnly = true;

    }
  }
}
