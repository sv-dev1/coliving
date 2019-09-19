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
			return response;
		})
		.catch((error:Error) => {
			return Observable.throw(error);
		});
	}
	login(input_data){
		return this.http.post(this.base_url+'login',input_data)
		.map((response:Response)=>{
			return response;
		})
		.catch((error:Error) => {
			return Observable.throw(error);});
	}
	getUserData(){ 
		let token; 
		if(sessionStorage.getItem("auth_token")!=undefined){
			token = sessionStorage.getItem("auth_token"); 
		}
		let headers = new HttpHeaders();
		headers = headers.set('Authorization', token);
		return this.http.get(this.base_url+'user/profile',{ headers: headers })
		.map((response:Response)=>{			
			return response;
		})
		.catch((error:Error) => {
			return Observable.throw(error);});
	}
	getUsers(){ 
		let token; 
		if(sessionStorage.getItem("auth_token")!=undefined){
			token = sessionStorage.getItem("auth_token"); 
		}
		let headers = new HttpHeaders();
		headers = headers.set('Authorization', token);
		headers.set('Content-Type', null);
		headers.set('Accept', "multipart/form-data");
		return this.http.get(this.base_url+'users',{ headers: headers })
		.map((response:Response)=>{
			return response;
		})
		.catch((error:Error) => {
			return Observable.throw(error);});
	}
	getCategories(){ 
		let token; 
		if(sessionStorage.getItem("auth_token")!=undefined){
			token = sessionStorage.getItem("auth_token"); 
		}
		let headers = new HttpHeaders();
		headers = headers.set('Authorization', token);
		return this.http.get(this.base_url+'categories',{ headers: headers })
		.map((response:Response)=>{
			return response;
		})
		.catch((error:Error) => {
			return Observable.throw(error);});
	}
	getTeams(){
		let token; 
		if(sessionStorage.getItem("auth_token")!=undefined){
			token = sessionStorage.getItem("auth_token"); 
		}
		let headers = new HttpHeaders();
		headers = headers.set('Authorization', token);
		return this.http.get(this.base_url+'getTeam',{ headers: headers })
		.map((response:Response)=>{
			return response;
		})
		.catch((error:Error) => {
			return Observable.throw(error);});
	}
}
