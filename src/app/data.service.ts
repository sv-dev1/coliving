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
	createBill(input_data){
		let token; 
		if(sessionStorage.getItem("auth_token")!=undefined){
			token = sessionStorage.getItem("auth_token"); 
		} 
		const httpOptions = { headers: new HttpHeaders({'authorization': token })}; 
		return this.http.post(this.base_url+'createBills',input_data,httpOptions)
		.map((response:Response)=>{
			console.log('createBills response',response);
			return response;
		})
		.catch((error:Error) => {
			console.log('error',error);
			return Observable.throw(error);});
	}
	getTeam(){ 
		let token; 
		if(sessionStorage.getItem("auth_token")!=undefined){
			token = sessionStorage.getItem("auth_token"); 
		}
		let headers = new HttpHeaders();
		headers = headers.set('Authorization', token);
		headers.set('Content-Type', null);
		headers.set('Accept', "multipart/form-data");
		return this.http.get(this.base_url+'getTeam',{ headers: headers })
		.map((response:Response)=>{
			//   console.log('team response',response);
			return response;
		})
		.catch((error:Error) => {
			console.log('error',error);
			return Observable.throw(error);});
	}
	getTeamUsers(postArr){ 
		let token; 
		if(sessionStorage.getItem("auth_token")!=undefined){
			token = sessionStorage.getItem("auth_token"); 
		}
		let headers = new HttpHeaders();
		headers = headers.set('Authorization', token);
		headers.set('Content-Type', null);
		headers.set('Accept', "multipart/form-data");
		const httpOptions = { headers: new HttpHeaders({'Content-Type': 'application/json', 'authorization': token })}; 
		return this.http.post(this.base_url+'team/users',postArr,httpOptions)
		.map((response:Response)=>{
			console.log('TeamUser response',response);
			return response;
		})
		.catch((error:Error) => {
			console.log('error',error);
			return Observable.throw(error);
		})
	}
	createTeam(formData){
		let token; 
		if(sessionStorage.getItem("auth_token")!=undefined){
			token = sessionStorage.getItem("auth_token"); 
		} 
		const httpOptions = { headers: new HttpHeaders({'authorization': token })}; 
		return this.http.post(this.base_url+'createTeam',formData,httpOptions)
		.map((response:Response)=>{
			console.log('createTeam response',response);
			return response;
		})
		.catch((error:Error) => {
			console.log('error',error);
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
			//   console.log('team response',response);
			return response;
		})
		.catch((error:Error) => {
			console.log('error',error);
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

	getTask(){ 
		let token; 
		if(sessionStorage.getItem("auth_token")!=undefined){
			token = sessionStorage.getItem("auth_token"); 
		}
		let headers = new HttpHeaders();
		headers = headers.set('Authorization', token);
		return this.http.get(this.base_url+'tasks',{ headers: headers })
		.map((response:Response)=>{
			return response;
		})
		.catch((error:Error) => {
			return Observable.throw(error);});

	}
	getTaskSuggestionByTeamId(teamID){ 
		let token; 
		if(sessionStorage.getItem("auth_token")!=undefined){
			token = sessionStorage.getItem("auth_token"); 
		}
		let headers = new HttpHeaders();
		headers = headers.set('Authorization', token);
		let url = this.base_url+'task/'+teamID+'/suggestion';
		return this.http.get(url,{ headers: headers })
		.map((response:Response)=>{
			return response;
		})
		.catch((error:Error) => {
			return Observable.throw(error);});

	}
	addSuggestion(input) {
		let token; 
		if(sessionStorage.getItem("auth_token")!=undefined){
			token = sessionStorage.getItem("auth_token"); 
		}
		let headers = new HttpHeaders();
		headers = headers.set('Authorization', token);
	        let userId = sessionStorage.getItem('userId');
			const input_data = {
				'taskId': input.taskId,
				'notes': input.notes,
				'userId':userId
			}
			let url = this.base_url+'task/suggestion';
			return this.http.post(url ,input_data,{ headers: headers })
			.map((response:Response)=>{
				return response;
			})
			.catch((error:Error) => {
				return Observable.throw(error);});
	}
	forgetPassword(input_data){
		return this.http.post(this.base_url+'forget-password',input_data)
		.map((response:Response)=>{
			return response;
		})
		.catch((error:Error) => {
			return Observable.throw(error);});
	}
	verifyToken(input_data){
		let url = this.base_url+'reset/'+input_data;
		return this.http.post(url , "")
		.map((response:Response)=>{
			return response;
		})
		.catch((error:Error) => {
			return Observable.throw(error);});
	}
	resetPassword(inputData){
		let userId = inputData.user_id;
		let token = inputData.token;
		const input_data = {
			'password': inputData.password,
			'password2': inputData.password2
		}
		let url = this.base_url+'reset/password/'+userId+'/'+token;
		return this.http.post(url ,input_data)
		.map((response:Response)=>{
			return response;
		})
		.catch((error:Error) => {
			return Observable.throw(error);});
	}
	getTaskById(id){
		let token; 
		if(sessionStorage.getItem("auth_token")!=undefined){
			token = sessionStorage.getItem("auth_token"); 
		}
		let headers = new HttpHeaders();
		headers = headers.set('Authorization', token);
		console.log(this.base_url+'tasks/'+id);
		return this.http.get(this.base_url+'tasks/'+id,{ headers: headers })
		.map((response:Response)=>{
			console.log(response);
			return response;
		})
		.catch((error:Error) => {
			return Observable.throw(error);});


	}
	
}
