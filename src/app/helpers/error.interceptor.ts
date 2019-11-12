import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor,HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    executing:boolean=false;
    constructor(
        private router: Router,
        public toastr: ToastrManager,
    ) {}
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        return next.handle(request).pipe(
            map((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                    // /console.log('event--->>>', event);
                     if(event.status == 401 && !this.executing){
                        this.executing=true;
                        this.toastr.errorToastr('Session Expired,Please Login again');
                        sessionStorage.removeItem("auth_token");
                        sessionStorage.removeItem("userId");
                        sessionStorage.removeItem("questionaire");
                        sessionStorage.removeItem("user_name");
                        this.router.navigate(['/login']);
                    }
                    if(event.status == 500){
                        this.toastr.errorToastr('Internal server Error');
                    }
                    if(event.status == 503 && !this.executing){
                        this.executing=true;
                        this.toastr.errorToastr('Service Unavailable');                       
                    }

                }
                return event;
            }),
            catchError((err: HttpErrorResponse) => {
                console.log('err',err);
                const error = err.error.message || err.statusText;
                console.log(this.executing);

                if(err.status == 0 && this.executing == false){
                   
                    this.toastr.errorToastr('Service Unavailable');
                    this.executing = true;
                    sessionStorage.removeItem("auth_token");
                    sessionStorage.removeItem("userId");
                    sessionStorage.removeItem("questionaire");
                    sessionStorage.removeItem("user_name");
                    this.router.navigate(['/login']);
                 }
                if(err.status == 401 && !this.executing){
                    this.toastr.errorToastr('Session Expired,Please Login again');
                     this.executing = true;
                    sessionStorage.removeItem("auth_token");
                    sessionStorage.removeItem("userId");
                    sessionStorage.removeItem("questionaire");
                    sessionStorage.removeItem("user_name");                    
                    this.router.navigate(['/login']);
                }
                
                if(err.error.username) {
                    this.toastr.errorToastr(err.error.username,'Error');
                } if(err.error.email) {
                    this.toastr.errorToastr(err.error.email,'Error');
                } if(err.error.password) {
                    this.toastr.errorToastr(err.error.password,'Error');
                } if(err.error.referalCode) {
                    this.toastr.errorToastr(err.error.referalCode,'Error');
                } if(err.error.newPassword) {
                     this.toastr.errorToastr(err.error.newPassword,'Error');
                } if(err.error.newPassword2) {
                     this.toastr.errorToastr(err.error.newPassword2,'Error');
                } if(err.error.ref_code) {
                     this.toastr.errorToastr(err.error.ref_code,'Error');
                }
                return throwError(err);
            }));
    }
   
}
