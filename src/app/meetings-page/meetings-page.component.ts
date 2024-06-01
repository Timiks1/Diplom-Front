import { Component } from '@angular/core';
import { ServerService } from '../Server/server.service';
@Component({
  selector: 'app-meetings-page',
  templateUrl: './meetings-page.component.html',
  styleUrls: ['./meetings-page.component.css']
})
export class MeetingsPageComponent {
  meetings: any[] = [];
  
  constructor(private serverService: ServerService) {}

  ngOnInit(): void {
    this.loadMeetings();
  }

  loadMeetings(): void {
    const departmentId = this.serverService.currentUserValue.departmentId;
    this.serverService.getDepartmentMeetings(departmentId).subscribe(
      (meetings: any[]) => {
        this.meetings = meetings;
        console.log('Meetings loaded:', this.meetings);
      },
      error => {
        console.error('Error fetching meetings:', error);
      }
    );
  }

  downloadFile(fileContent: string, fileName: string): void {
    const byteCharacters = atob(fileContent);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/octet-stream' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
  }
}
