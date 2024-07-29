import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  let authService = localStorage.getItem('token');
  const router = inject(Router);

  if (authService) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
