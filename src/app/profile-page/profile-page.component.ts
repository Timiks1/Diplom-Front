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
    profilePhotoUrl: string | null = null; // URL для отображения фото

  constructor(private serverService: ServerService) { }

  ngOnInit(): void {
    this.getProfile();
    this.getCertificates();
  }

  getProfile(): void {
    this.serverService.getCurrentUser().subscribe(response => {
      this.profile = response.item;
      if (this.profile.photoBase64) {
        this.profilePhotoUrl = `data:image/jpeg;base64,${this.profile.photoBase64}`;
      }
    }, error => {
      console.error('Error fetching profile:', error);
    });
  }
  arrayBufferToBase64(buffer: any): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return 'data:image/jpeg;base64,' + window.btoa(binary);
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

  onUploadPhoto(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        this.profile.photo = base64.split(',')[1]; // Убираем префикс "data:image/jpeg;base64,"
        this.updateProfileWithPhoto();
      };
      reader.readAsDataURL(file);
    }
  }
  
  updateProfileWithPhoto(): void {
    this.serverService.updateProfile(this.profile).subscribe(
      response => {
        console.log('Profile photo updated successfully:', response);
        this.getProfile(); // Обновить профиль для отображения новой фотографии
      },
      error => {
        console.error('Error updating profile photo:', error);
      }
    );
  }
  
  openFileDialog(): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = this.onUploadPhoto.bind(this);
    input.click();
  }
  
}
