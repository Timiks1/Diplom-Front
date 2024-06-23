import { Component } from '@angular/core';
import { ServerService } from '../Server/server.service';

@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.component.html',
  styleUrls: ['./chat-page.component.css']
})
export class ChatPageComponent {
  messages: any[] = [];
  newMessage: string = '';
  searchTerm: string = '';
  allUsers: any[] = [];
  searchResults: any[] = [];
  selectedUserId: string = '';
  currentUserId: string = '';
  userChats: any[] = [];
  selectedUserName: string = ''; // Новое свойство для хранения имени выбранного пользователя

  constructor(private serverService: ServerService) {
    this.currentUserId = this.serverService.currentUserValue.userId;
  }

  ngOnInit() {
    this.loadAllUsers();
    this.loadUserChats();
  }

  loadAllUsers() {
    this.serverService.getAllUsers().subscribe((response: any) => {
      this.allUsers = response.items;
    });
  }

  loadUserChats() {
    this.serverService.getUserChats(this.currentUserId).subscribe((response: any) => {
      this.userChats = response.items;
      console.log(this.userChats)
    });
  }

  searchUsers() {
    if (this.searchTerm.trim()) {
      this.searchResults = this.allUsers.filter(user => 
        user.firstName.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.searchResults = [];
    }
  }

  selectUser(userId: string) {
    this.selectedUserId = userId;
    this.selectedUserName = this.allUsers.find(user => user.id === userId)?.firstName || ''; // Установка имени выбранного пользователя

    this.searchTerm = '';
    this.searchResults = [];
    this.loadMessages();
  }

  loadMessages() {
    if (this.selectedUserId) {
      this.serverService.getChatHistory(this.currentUserId, this.selectedUserId).subscribe((response: any) => {
        this.messages = response.items.map((message: any) => ({
          ...message,
          isSelf: message.senderId === this.currentUserId
        }));
      });
    }
  }

  sendMessage() {
    if (this.newMessage.trim()) {
      const chatMessageDto = {
        message: this.newMessage,
        senderId: this.currentUserId,
        receiverId: this.selectedUserId,
        timeCreation: new Date()
      };
      this.serverService.sendMessage(chatMessageDto).subscribe(() => {
        this.newMessage = '';
        this.loadMessages();
      });
    }
  }
}