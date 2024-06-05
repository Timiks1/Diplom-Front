import { Component } from '@angular/core';
import { ServerService } from '../Server/server.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-individual-plan-page',
  templateUrl: './individual-plan-page.component.html',
  styleUrls: ['./individual-plan-page.component.css']
})
export class IndividualPlanPageComponent {
  selectedIndividualPlanFile: File | null = null;
  selectedDevelopmentPlanFile: File | null = null;

  constructor(private serverService: ServerService) { }

  onIndividualPlanFileSelected(event: any): void {
    this.selectedIndividualPlanFile = event.target.files[0];
  }

  onDevelopmentPlanFileSelected(event: any): void {
    this.selectedDevelopmentPlanFile = event.target.files[0];
  }

  downloadIndividualPlanTemplate(): void {
    this.serverService.downloadPlanTemplate().subscribe(response => {
      saveAs(response, 'individual-plan-template.xlsx');
    }, error => {
      console.error('Ошибка загрузки шаблона плана:', error);
    });
  }

  downloadDevelopmentPlanTemplate(): void {
    this.serverService.downloadDevelopmentPlanTemplate().subscribe(response => {
      saveAs(response, 'development-plan-template.xlsx');
    }, error => {
      console.error('Ошибка загрузки шаблона плана:', error);
    });
  }

  onSubmitIndividualPlan(): void {
    if (this.selectedIndividualPlanFile) {
      this.serverService.uploadFilledPlan(this.selectedIndividualPlanFile).subscribe(response => {
        console.log(response);
        // Обработка ответа
      }, error => {
        console.error('Ошибка загрузки файла:', error);
      });
    }
  }

  onSubmitDevelopmentPlan(): void {
    if (this.selectedDevelopmentPlanFile) {
      this.serverService.uploadDevelopmentPlan(this.selectedDevelopmentPlanFile).subscribe(response => {
        console.log(response);
        // Обработка ответа
      }, error => {
        console.error('Ошибка загрузки файла:', error);
      });
    }
  }
}