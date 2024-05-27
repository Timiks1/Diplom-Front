import { Component } from '@angular/core';
import { ServerService } from '../Server/server.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-individual-plan-page',
  templateUrl: './individual-plan-page.component.html',
  styleUrls: ['./individual-plan-page.component.css']
})
export class IndividualPlanPageComponent {
  selectedFile: File | null = null;

  constructor(private serverService: ServerService) { }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  downloadTemplate(): void {
    this.serverService.downloadPlanTemplate().subscribe(response => {
      saveAs(response, 'plan-template.xlsx');
    }, error => {
      console.error('Ошибка загрузки шаблона плана:', error);
    });
  }

  onSubmit(): void {
    if (this.selectedFile) {
      this.serverService.uploadFilledPlan(this.selectedFile).subscribe(response => {
        console.log(response);
        // Обработка ответа
      }, error => {
        console.error('Ошибка загрузки файла:', error);
      });
    }
  }
}
