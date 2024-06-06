// exchange-visits-page.component.ts
import { Component } from '@angular/core';
import { ServerService } from '../Server/server.service';
@Component({
  selector: 'app-exchange-visits-page',
  templateUrl: './exchange-visits-page.component.html',
  styleUrls: ['./exchange-visits-page.component.css']
})
export class ExchangeVisitsPageComponent {
  selectedTab: string = 'plans';
  selectedPlanFile: File | null = null;
  selectedFeedbackFile: File | null = null;
  templateFiles: any[] = [];
  reviews: any[] = [];

  constructor(private serverService: ServerService) {}

  ngOnInit(): void {
    this.downloadTemplate();
    this.fetchReviews(); // Fetch reviews when the component initializes
  }

  setTab(tab: string): void {
    this.selectedTab = tab;
  }

  downloadTemplate(): void {
    this.serverService.downloadTemplate().subscribe(
      response => {
        if (response.success && response.item) {
          if (Array.isArray(response.item)) {
            this.templateFiles = response.item;
          } else {
            this.templateFiles = [response.item];
          }
          console.log('Template files loaded:', this.templateFiles);
        } else {
          console.error('Error response:', response);
        }
      },
      error => {
        console.error('Error downloading template:', error);
      }
    );
  }

  downloadFile(base64File: string, fileName: string): void {
    if (this.isBase64(base64File)) {
      const byteCharacters = atob(base64File);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/octet-stream' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${fileName}.docx`;
      link.click();
    } else {
      console.error('The file content is not a valid Base64 string:', base64File);
    }
  }

  downloadReviewFile(base64File: string, fileName: string): void {
    this.downloadFile(base64File, fileName);
  }

  onFileSelected(event: any, type: string): void {
    if (type === 'plan') {
      this.selectedPlanFile = event.target.files[0];
    } else if (type === 'feedback') {
      this.selectedFeedbackFile = event.target.files[0];
    }
  }

  uploadFile(type: string): void {
    const file = type === 'plan' ? this.selectedPlanFile : this.selectedFeedbackFile;
    if (!file) {
      console.error('No file selected');
      return;
    }
    const userId = this.serverService.currentUserValue.userId;
    const fileName = `${this.serverService.currentUserValue.firstName} ${this.serverService.currentUserValue.lastName}.exchangevisitplan`;

    this.serverService.uploadExchangeVisitFile(file, userId, fileName).subscribe(
      response => {
        console.log('File uploaded successfully:', response);
      },
      error => {
        console.error('Error uploading file:', error);
      }
    );
  }

  fetchReviews(): void {
    const teacherId = this.serverService.currentUserValue.userId;
    this.serverService.getTeacherReviews(teacherId).subscribe(
      response => {
        if (response.success && response.items) {
          this.reviews = response.items;
          console.log('Reviews loaded:', this.reviews);
        } else {
          console.error('Error response:', response);
        }
      },
      error => {
        console.error('Error fetching reviews:', error);
      }
    );
  }

  private isBase64(str: string): boolean {
    try {
      return btoa(atob(str)) === str;
    } catch (err) {
      return false;
    }
  }
}