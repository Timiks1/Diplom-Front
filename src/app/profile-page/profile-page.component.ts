import { Component } from '@angular/core';
import { ServerService } from '../Server/server.service';
import { User } from '../Server/user.interface';
@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent {
    // user : User;
    // constructor(private serverService : ServerService){
    //   this.serverService.getUser(userId).subscribe((data: User) => {
    //     this.user = data;
    //   });
    // }

}
