import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const expectedRole = route.data['role'];
  const currentRole = authService.userRole();

  if (currentRole === expectedRole) {
    return true;
  }
  
  // If they are logged in but accessing the wrong role's page, bounce them back to their own dashboard
  if (currentRole === 'ADMIN') {
    router.navigate(['/admin/home']);
  } else if (currentRole === 'USER') {
    router.navigate(['/user/home']);
  } else {
    router.navigate(['/login']);
  }
  
  return false;
};
