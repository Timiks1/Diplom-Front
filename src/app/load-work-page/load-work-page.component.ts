import { Component } from '@angular/core';
import { ServerService } from '../Server/server.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-load-work-page',
  templateUrl: './load-work-page.component.html',
  styleUrls: ['./load-work-page.component.css']
})
export class LoadWorkPageComponent {
  selectedFile: File | null = null;

  constructor(private serverService : ServerService ) { }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  onSubmit(): void {
    if (this.selectedFile) {
      this.serverService.uploadWorkloadFile(this.selectedFile).subscribe(response => {
        console.log(response);
        // Добавьте логику для обработки ответа
      }, error => {
        console.error('Ошибка загрузки файла:', error);
      });
    }
  }
  downloadTemplate(): void {
    this.serverService.downloadWorkLoadTemplate().subscribe(response => {
      saveAs(response, 'plan-template.xlsx');
    }, error => {
      console.error('Ошибка загрузки шаблона плана:', error);
    });
  }
}
