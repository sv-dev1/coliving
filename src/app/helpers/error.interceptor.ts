import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor,HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(
        private router: Router,
        public toastr: ToastrManager,
    ) {}
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        return next.handle(request).pipe(
            map((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                    //console.log('event--->>>', event);
                     if(event.status == 401){
                        this.toastr.errorToastr('Session Expired,Please Login again');
                        sessionStorage.removeItem("auth_token");
                        this.router.navigate(['']);
                    }
                    if(event.status == 500){
                        this.toastr.errorToastr('Internal server Error');
                    }
                    if(event.status == 503){
                        this.toastr.errorToastr('Service Unavailable');
                    }
                }
                return event;
            }),
            catchError((err: HttpErrorResponse) => {
                
                const error = err.error.message || err.statusText;
                    if(err.status == 0){
                    this.toastr.errorToastr('Service Unavailable');
                }
                return throwError(err);
        }));
    }
   
}
