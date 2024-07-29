import { Component } from '@angular/core';
import { CommonService } from './common.service';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  animations: [
    trigger('slideInOut', [
      state('open', style({
        transform: 'translateX(0)'
      })),
      state('closed', style({
        transform: 'translateX(-100%)'
      })),
      transition('open => closed', [
        animate('0.3s ease-in-out')
      ]),
      transition('closed => open', [
        animate('0.3s ease-in-out')
      ])
    ])
  ]
})
export class AppComponent {
  isOpen = false;
  title = 'task-managment';
  constructor(public commonService: CommonService) { }


  toggleSidebar() {
    this.commonService.isOpen = !this.commonService.isOpen;
  }
}


