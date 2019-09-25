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
                    var strung = JSON.stringify(err['error']);
                 //   console.log(strung.substring(1,strung.length-1));
                    
                    if(err.status == 401){
                        this.toastr.errorToastr('Error 401:Session Expired');
                        this.router.navigate(['/login']);
                        this.toastr.errorToastr('You must login first!');
                    }
                    else{
                    //   console.log(err);
                        this.toastr.errorToastr(strung.substring(1,strung.length-1));
                    }   
            }
                return of(err);
            }));
    
      
      
}
}
