import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Retrieve the token from local storage
    const token: any =localStorage.getItem('token')?JSON.parse(localStorage.getItem('token')):'';

    // Clone the request to add the new header
    let clonedReq = req;
    if (token) {
      clonedReq = req.clone({
        headers: req.headers.set('auth-token', token.token)
      });
    }

    return next.handle(clonedReq).pipe(
      catchError((error: HttpErrorResponse) => {
        // Check for 401 Unauthorized status
        if (error.status === 401) {
          // Redirect to the login page
          this.router.navigate(['/login']);
        }
        return throwError(error);
      })
    );
  }
}
