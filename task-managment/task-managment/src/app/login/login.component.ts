import { Component, OnInit } from '@angular/core';
import { CommonService } from '../common.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  loginModel: any = {};
  constructor(private commonService: CommonService, private router: Router) {

  }
  ngOnInit() {
    let token = localStorage.getItem('token');
    // if (token) {
    //   this.router.navigate(['/dashboard']);
    // }
  }


  login() {
    this.commonService.login(this.loginModel).subscribe((res: any) => {
      if (res) {
        localStorage.setItem('token', JSON.stringify(res))
        this.router.navigate(['/dashboard']);
      }
      console.log(res);
    })
  }
}
