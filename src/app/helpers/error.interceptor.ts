import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpResponse, HttpErrorResponse }   from '@angular/common/http';
import { Injectable } from "@angular/core"
import { Observable, of } from "rxjs";
import { tap, catchError } from "rxjs/operators";
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(
        private router: Router,
        public toastr: ToastrManager,
    ) {}
    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
      ): Observable<HttpEvent<any>> {
    
        return next.handle(req).pipe(
            tap(evt => {
                if (evt instanceof HttpResponse) {
                    if(evt.body && evt.body.success)
                        this.toastr.successToastr(evt.body.success.message, evt.body.success.title, { positionClass: 'toast-bottom-center' });
                }
            }),
            catchError((err: any) => {
                if(err instanceof HttpErrorResponse) {
                    console.log(err);
                    var strung = JSON.stringify(err['error']);
                   // console.log(strung.substring(1,strung.length-1));

                    if(err.status == 401){
                        this.toastr.errorToastr('Session Expired');
                        this.router.navigate(['/login']);
                        this.toastr.errorToastr('You must login first!');
                    }
                    if(err.status == 404){
                        this.toastr.errorToastr('Username does not exist');
                    }
                    if(err['error'].password){
                       this.toastr.errorToastr('Password is invalid');
                    }
                    if(err.status == 500){
                        this.toastr.errorToastr('Internal server Error');
                    }
                    if(err.status == 503){
                        this.toastr.errorToastr('Service Unavailable');
                    }
                      
            }
                return of(err);
            }));
    
      
      
}
}
