import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, NavigationEnd } from '@angular/router';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from '../data.service';
import { ToastrManager } from 'ng6-toastr-notifications';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  session_key: boolean;
  constructor(
      private router: Router,
      private route :ActivatedRoute,
      private data_services: DataService,
      public toastr: ToastrManager,
    ){
     
  }
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
   
     
    if(sessionStorage.getItem("auth_token") != undefined){
      return true;
    } else {
      this.router.navigate(['/login']);
      this.toastr.infoToastr('You must be login first!!');
      return false;
    }   
  }
}