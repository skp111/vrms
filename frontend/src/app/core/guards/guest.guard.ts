import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const guestGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    const role = authService.userRole();
    if (role === 'ADMIN') {
      router.navigate(['/admin/home']);
    } else {
      router.navigate(['/user/home']);
    }
    return false;
  }
  
  return true;
};
