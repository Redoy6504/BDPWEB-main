import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';
import { CommonHelper } from './CommonHelper';

export const AuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);


  // Get the current user and allowed menus
  const currentUser = CommonHelper.GetUser(); // Fetch from local storage, session, or helper
  const allowedMenus:any[]= []; // Example: [{ RoutingPath: '/customerDetails' }]

  // Check if user is authenticated and token is valid
  if (authService.isLogin() && !authService.isTokenExpired(currentUser?.JwtToken)) {
    // Extract the base path by removing any dynamic segments (e.g., /:id)
    const basePath = state.url.split('/')[1]; // Extracts the first part of the path
    const dynamicBasePath = `/${basePath}`;

    // Check if the base path exists in the allowed menu list
    const isMenuAllowed = allowedMenus.some(menu => menu.RoutingPath === dynamicBasePath);

    // if (isMenuAllowed) {
      return true; // Allow access
    // } else {
    //   // Redirect to Access Denied page
    //   router.navigate(['/access-denied']);
    //   return false;
    // }
  } else {
    // Redirect to login page if unauthenticated
    router.navigate(['/']);
    return false;
  }
};
