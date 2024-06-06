import { Component } from '@angular/core';
import { ServerService } from '../Server/server.service';
import { User } from '../Server/user.interface';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent {
  profile: any = {};
  certificates: any[] = [];
  selectedCertificateFile: File | null = null;
  certificateName: string = '';
  constructor(private serverService: ServerService) { }

  ngOnInit(): void {
    this.getProfile();
    this.getCertificates();
  }

  getProfile(): void {
    this.serverService.getCurrentUser().subscribe(response => {
      this.profile = response.item;
    }, error => {
      console.error('Error fetching profile:', error);
    });
  }

  getCertificates(): void {
    this.serverService.getCertificates().subscribe(response => {
      this.certificates = response.items;
    }, error => {
      console.error('Error fetching certificates:', error);
    });
  }

  onSave(): void {
    this.serverService.updateProfile(this.profile).subscribe(response => {
      console.log('Profile updated successfully:', response);
    }, error => {
      console.error('Error updating profile:', error);
    });
  }

  onCertificateSelected(event: any): void {
    this.selectedCertificateFile = event.target.files[0];
  }

  onUploadCertificate(): void {
    if (this.selectedCertificateFile && this.certificateName) {
      this.serverService.uploadCertificate(this.selectedCertificateFile, this.certificateName).subscribe(response => {
        console.log('Certificate uploaded successfully:', response);
        this.getCertificates(); // Refresh the certificate list
      }, error => {
        console.error('Error uploading certificate:', error);
      });
    }
  }

  downloadCertificate(certificateId: string): void {
    this.serverService.downloadCertificate(certificateId).subscribe(response => {
      saveAs(response, 'certificate.rar');
    }, error => {
      console.error('Error downloading certificate:', error);
    });
  }
  deleteCertificate(certificateId: string): void {
    this.serverService.deleteCertificate(certificateId).subscribe(response => {
      console.log('Certificate deleted successfully:', response);
      this.getCertificates(); // Refresh the certificate list
    }, error => {
      console.error('Error deleting certificate:', error);
    });
  }

  onUploadPhoto(): void {
    // Логика для загрузки фото
  }
}
