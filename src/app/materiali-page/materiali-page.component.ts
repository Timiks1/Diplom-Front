import { Component } from '@angular/core';

@Component({
  selector: 'app-materiali-page',
  templateUrl: './materiali-page.component.html',
  styleUrls: ['./materiali-page.component.css']
})
export class MaterialiPageComponent {
  selectedTab: string = 'methodical';

  selectTab(tab: string) {
    this.selectedTab = tab;
  }
}
