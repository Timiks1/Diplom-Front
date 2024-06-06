import { Component } from '@angular/core';
import { ServerService } from '../Server/server.service';
@Component({
  selector: 'app-contacts-page',
  templateUrl: './contacts-page.component.html',
  styleUrls: ['./contacts-page.component.css']
})
export class ContactsPageComponent {
  contacts: any;
  departments: any[] = [];
  users: any[] = [];
  selectedDepartment: any;
  constructor(private serverService: ServerService) {}

  ngOnInit(): void {
    this.loadContacts();
    this.loadDepartments();

  }

  loadContacts(): void {
    this.serverService.getUniversityContacts().subscribe(
      response => {
        if (response && response.success && response.item) {
          this.contacts = response.item;
          console.log('Contacts loaded:', this.contacts);
        } else {
          console.error('Failed to load contacts');
        }
      },
      error => {
        console.error('Error fetching contacts:', error);
      }
    );
  }
  loadDepartments(): void {
    this.serverService.getDepartments().subscribe(
      response => {
        if (response && response.items) {
          this.departments = response.items;
          const targetDepartment = this.departments.find(dept => dept.name === 'НАВЧАЛЬНА ЧАСТИНА');
          if (targetDepartment) {
            this.selectedDepartment = targetDepartment;
            this.loadUsersByDepartmentId(targetDepartment.id);
          }
        } else {
          console.error('Failed to load departments');
        }
      },
      error => {
        console.error('Error fetching departments:', error);
      }
    );
  }

  loadUsersByDepartmentId(departmentId: string): void {
    this.serverService.getUsersByDepartmentId(departmentId).subscribe(
      response => {
        if (response && response.items) {
          this.users = response.items;
          console.log('Users loaded:', this.users);
        } else {
          console.error('Failed to load users');
        }
      },
      error => {
        console.error('Error fetching users by department ID:', error);
      }
    );
  }
}
