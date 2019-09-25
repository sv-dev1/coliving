import { Injectable, Injector } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { NgxUiLoaderService } from 'ngx-ui-loader'; // Import NgxUiLoaderService

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
    constructor(private injector: Injector, private ngxService: NgxUiLoaderService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.ngxService.start();

        return next.handle(request).pipe(
       
          finalize(() => this.ngxService.stop())
        );
    }
}
