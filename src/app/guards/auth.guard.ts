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
    }else{
     // this.toastr.errorToastr('You must be login first');
      this.router.navigate(['/login']);
    }   
  }
}