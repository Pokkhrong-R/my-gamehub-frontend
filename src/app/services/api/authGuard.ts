import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth';


@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}



  canActivate(route: ActivatedRouteSnapshot): boolean {
  if (!this.authService.isAuthenticated()) {
    console.error('AuthGuard: Not logged in. Redirecting to login.');
    this.router.navigate(['/loginpage']);
    return false;
  }
  


  const currentUser = this.authService.getCurrentUser();
  const requiredRole = route.data['role'];
  
 
  console.log("-----------------------------------------");
  console.log("AuthGuard is checking roles...");
  console.log(`Value of currentUser.role: `, currentUser?.role);
  console.log(`Type of currentUser.role:  `, typeof currentUser?.role);
  console.log(`Value of requiredRole:     `, requiredRole);
  console.log(`Type of requiredRole:      `, typeof requiredRole);
  console.log(`Are they equal? (===):     `, currentUser?.role === requiredRole);
  console.log("-----------------------------------------");
    console.log("currentUser:",this.authService.currentUser);

  if (currentUser && currentUser.role === requiredRole) {
  
    return true; 
  }
  

  console.error('AuthGuard: Access Denied. User does not have the required role.');
  alert('คุณไม่มีสิทธิ์เข้าถึงหน้านี้');

  
  if (currentUser && currentUser.role === 1) {
    this.router.navigate(['/user/home']);
  } else if (currentUser && currentUser.role === 0) {
    this.router.navigate(['/admin/home']);
  } else {
    this.router.navigate(['/loginpage']);
  }

  return false;
}
}