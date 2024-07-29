import { Component, OnInit } from '@angular/core';
import { CommonService } from '../common.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {

  registerModel: any = {};
  constructor(private commonService: CommonService, private router: Router) {

  }
  ngOnInit() {
    let token = localStorage.getItem('token');
    if (token) {
      this.router.navigate(['/dashboard']);
    }
  }


  register() {
    this.commonService.registerUser(this.registerModel).subscribe((res: any) => {
      if (res.token) {
        localStorage.setItem('token', res.token)
        this.router.navigate(['/dashboard']);
      }
    })
  }
}
