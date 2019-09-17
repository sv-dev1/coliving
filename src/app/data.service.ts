import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient, HttpHeaders,HttpClientModule } from '@angular/common/http'; 
import { Router } from '@angular/router';

import { map, catchError } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject'; 
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';


@Injectable({
	providedIn: 'root'
})
export class DataService {
	base_url : string = "";
	constructor( private http : HttpClient,
		         
		) {
		this.base_url = environment.base_url;
	}
	register(input_data){
		return this.http.post(this.base_url+'register',input_data)
		.map((response:Response)=>{
			console.log('register response',response);
			return response;
		})
		.catch((error:Error) => {
			console.log(error);
			return Observable.throw(error);
		});
	}
	login(input_data){
		return this.http.post(this.base_url+'login',input_data)
		.map((response:Response)=>{
            console.log('login response',response);
			return response;
		})
		.catch((error:Error) => {
			console.log('error',error);
			return Observable.throw(error);});
	}
}
