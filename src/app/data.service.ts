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
	apiRegister(input_data){
		return this.http.post(this.base_url+'apiregister',input_data)
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
			//console.log('createBills response',response);
			return response;
		})
		.catch((error:Error) => {
			//console.log('error',error);
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
			//	console.log('TeamUser response',response);
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

	addCategory(formData){
		let token; 
		if(sessionStorage.getItem("auth_token")!=undefined){
			token = sessionStorage.getItem("auth_token"); 
		} 
		const httpOptions = { headers: new HttpHeaders({'authorization': token })}; 
		return this.http.post(this.base_url+'category',formData,httpOptions)
		.map((response:Response)=>{
			console.log('questionaire response',response);
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
	getAllIssues(){ 
		let token; 
		if(sessionStorage.getItem("auth_token")!=undefined){
			token = sessionStorage.getItem("auth_token"); 
		}
		let headers = new HttpHeaders();
		headers = headers.set('Authorization', token);
		return this.http.get(this.base_url+'issues',{ headers: headers })
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
		return this.http.get(this.base_url+'task/'+id+'/suggestion',{ headers: headers })
		.map((response:Response)=>{
			return response;
		})
		.catch((error:Error) => {
			return Observable.throw(error);});
	}
	deleteTask(inputData){
		let token; 
		if(sessionStorage.getItem("auth_token")!=undefined){
			token = sessionStorage.getItem("auth_token"); 
		}
		let headers = new HttpHeaders();
		headers = headers.set('Authorization', token);
		//console.log(this.base_url+'tasks/'+inputData);
		return this.http.delete(this.base_url+'task/'+inputData,{ headers: headers })
		.map((response:Response)=>{
			console.log(response);
			return response;
		})
		.catch((error:Error) => {
			return Observable.throw(error);});
	}
	deleteCategory(inputData){
		let token; 
		if(sessionStorage.getItem("auth_token")!=undefined){
			token = sessionStorage.getItem("auth_token"); 
		}
		let headers = new HttpHeaders();
		headers = headers.set('Authorization', token);
		console.log(this.base_url+'tasks/'+inputData);
		return this.http.delete(this.base_url+'category/'+inputData,{ headers: headers })
		.map((response:Response)=>{
			console.log(response);
			return response;
		})
		.catch((error:Error) => {
			return Observable.throw(error);});
	}
	editCategory(input_change){
		let token; 
		if(sessionStorage.getItem("auth_token")!=undefined){token = sessionStorage.getItem("auth_token"); }
		let headers = new HttpHeaders();
		headers = headers.set('Authorization', token);
		let url = this.base_url+'category/'+input_change.category_id;	    
		return this.http.put(url,input_change, { headers: headers })
		.map((response:Response)=>{
			const data = response;
			return data;
		})
		.catch((error:Error) => {
			//console.log(error);
			return Observable.throw(error);});

	} 

	changePassword(input_change){
		let token; 
		if(sessionStorage.getItem("auth_token")!=undefined){token = sessionStorage.getItem("auth_token"); }
		let headers = new HttpHeaders();
		headers = headers.set('Authorization', token);	    
		return this.http.put(this.base_url+'password',input_change, { headers: headers })
		.map((response:Response)=>{
			const data = response;
			return data;
		})
		.catch((error:Error) => {
			//console.log(error);
			return Observable.throw(error);});

	} 
	submitQuest(formData){
		let token; 
		if(sessionStorage.getItem("auth_token")!=undefined){
			token = sessionStorage.getItem("auth_token"); 
		} 
		const httpOptions = { headers: new HttpHeaders({'authorization': token })}; 
		return this.http.post(this.base_url+'user/questionnaire',formData,httpOptions)
		.map((response:Response)=>{
			console.log('questionaire response',response);
			return response;
		})
		.catch((error:Error) => {
			console.log('error',error);
			return Observable.throw(error);});
	}
	getCountries(){ 
		return this.http.get(this.base_url+'countries')
		.map((response:Response)=>{
			return response;
		})
		.catch((error:Error) => {
			return Observable.throw(error);});
	}
	getLanguages(){ 
		return this.http.get(this.base_url+'languages')
		.map((response:Response)=>{
			return response;
		})
		.catch((error:Error) => {
			return Observable.throw(error);});
	}
	getBills(){
		let token; 
		if(sessionStorage.getItem("auth_token")!=undefined){
			token = sessionStorage.getItem("auth_token"); 
		}
		let headers = new HttpHeaders();
		headers = headers.set('Authorization', token);		
		return this.http.get(this.base_url+'bills/',{ headers: headers })
		.map((response:Response)=>{
			return response;
		})
		.catch((error:Error) => {
			return Observable.throw(error);});
	}
	upDateProfile(formData){
		let token; 
		if(sessionStorage.getItem("auth_token")!=undefined){
			token = sessionStorage.getItem("auth_token"); 
		} 
		const httpOptions = { headers: new HttpHeaders({'authorization': token })}; 
		console.log(JSON.stringify(formData));
		return this.http.put(this.base_url+'user/profile',formData,httpOptions)
		.map((response:Response)=>{
			console.log('profile response',response);
			return response;
		})
		.catch((error:Error) => {
			console.log('error',error);
			return Observable.throw(error);});
	}
	currentLocation(pvarIp){
		return this.http.get('https://ipapi.co/'+pvarIp+'/json/' ) 
		.map((response:Response)=>{const data = response;return data;})
		.catch((error:Error) => {console.log(error);return Observable.throw(error);});
	}
	
	getProperties(){ 
		let token; 
		if(sessionStorage.getItem("auth_token")!=undefined){
			token = sessionStorage.getItem("auth_token"); 
		}
		let headers = new HttpHeaders();
		headers = headers.set('Authorization', token);
		return this.http.get(this.base_url+'properties',{ headers: headers })
		.map((response:Response)=>{
			return response;
		})
		.catch((error:Error) => {
			return Observable.throw(error);});
	}
	setNotification(input){
		let token; 
		if(sessionStorage.getItem("auth_token")!=undefined){
			token = sessionStorage.getItem("auth_token"); 
		} 
		const httpOptions = { headers: new HttpHeaders({'authorization': token })}; 
		return this.http.post(this.base_url+'user/settings',input,httpOptions)
		.map((response:Response)=>{
			return response;
		})
		.catch((error:Error) => {
			console.log('error',error);
			return Observable.throw(error);});
	}
	getAllMessagesByIssueId(id){
		let token; 
		if(sessionStorage.getItem("auth_token")!=undefined){
			token = sessionStorage.getItem("auth_token"); 
		}
		const postArr = {
			'issueId' : id
		};
		let headers = new HttpHeaders();
		headers = headers.set('Authorization', token);
		return this.http.post(this.base_url+'issues/thread/', postArr,{ headers: headers })
		.map((response:Response)=>{
			return response;
		})
		.catch((error:Error) => {
			return Observable.throw(error);});
	}

	addReply(formData){
		let token; 
		if(sessionStorage.getItem("auth_token")!=undefined){
			token = sessionStorage.getItem("auth_token"); 
		}
		let headers = new HttpHeaders();
		headers = headers.set('Authorization', token);
		return this.http.post(this.base_url+'issues/thread/addreply', formData,{ headers: headers })
		.map((response:Response)=>{
			return response;
		})
		.catch((error:Error) => {
			return Observable.throw(error);});
	}

	verifyEmailAddress(data){ 
		let token; 
		if(sessionStorage.getItem("auth_token")!=undefined){
			token = sessionStorage.getItem("auth_token"); 
		}
		let headers = new HttpHeaders();
		headers = headers.set('Authorization', token);
		let url = this.base_url+'verify/email/'+data.userId+'/'+data.token;
		return this.http.post(url,{ headers: headers })
		.map((response:Response)=>{
			return response;
		})
		.catch((error:Error) => {
			return Observable.throw(error);});

	}
	getPdfUsers(postArr){ 
		let token; 
		if(sessionStorage.getItem("auth_token")!=undefined){token = sessionStorage.getItem("auth_token"); }
		let headers = new HttpHeaders();
		headers = headers.set('Authorization', token);
		headers.set('Content-Type', null);
		headers.set('Accept', "multipart/form-data");
		const httpOptions = { headers: new HttpHeaders({'Content-Type': 'application/json', 'authorization': token })}; 
		return this.http.post(this.base_url+'team/users/pdf',postArr,httpOptions)
		.map((response:Response)=>{return response;})
		.catch((error:Error) => {console.log('error',error);return Observable.throw(error);})
	}

	
	getTeamApp(teamId){ 
		let token; 
		if(sessionStorage.getItem("auth_token")!=undefined){
			token = sessionStorage.getItem("auth_token"); 
		}
		let headers = new HttpHeaders();
		headers = headers.set('Authorization', token);
		headers.set('Content-Type', null);
		headers.set('Accept', "multipart/form-data");
		return this.http.get(this.base_url+'team/applications/'+teamId,{ headers: headers })
		.map((response:Response)=>{
			//   console.log('team response',response);
			return response;
		})
		.catch((error:Error) => {
			console.log('error',error);
			return Observable.throw(error);});
	}

	getUserApp(teamId){
		let token; 
		if(sessionStorage.getItem("auth_token")!=undefined){token = sessionStorage.getItem("auth_token"); }
		let headers = new HttpHeaders();
		headers = headers.set('Authorization', token);
		return this.http.get(this.base_url+'user/'+ teamId +'/questionnaire',{ headers: headers })		
		.map((response:Response)=>{return response;})
		.catch((error:Error) => {return Observable.throw(error);});
	}
	deleteIssue(issueId) {
		let token; 
		if(sessionStorage.getItem("auth_token")!=undefined){
			token = sessionStorage.getItem("auth_token"); 
		}
		let headers = new HttpHeaders();
		headers = headers.set('Authorization', token);
		//console.log(this.base_url+'tasks/'+inputData);
		return this.http.delete(this.base_url+'issues/remove/'+issueId,{ headers: headers })
		.map((response:Response)=>{
			console.log(response);
			return response;
		})
		.catch((error:Error) => {
			return Observable.throw(error);});
	}
	toDataURL(url, callback) {
		var xhr = new XMLHttpRequest();
		xhr.onload = function() {
			var reader = new FileReader();
			reader.onloadend = function() {
				callback(reader.result);
			}
			reader.readAsDataURL(xhr.response);
		};
		xhr.open('GET', url);
		xhr.responseType = 'blob';
		xhr.send();
	}

	addFaq(formData){
		let token; 
		if(sessionStorage.getItem("auth_token")!=undefined){
			token = sessionStorage.getItem("auth_token"); 
		} 
		const httpOptions = { headers: new HttpHeaders({'authorization': token })}; 
		return this.http.post(this.base_url+'faq/add',formData,httpOptions)
		.map((response:Response)=>{
			
			return response;
		})
		.catch((error:Error) => {
			console.log('error',error);
			return Observable.throw(error);});
	} 

	editFaq(input){
		let token; 
		if(sessionStorage.getItem("auth_token")!=undefined){token = sessionStorage.getItem("auth_token"); }
		let headers = new HttpHeaders();
		headers = headers.set('Authorization', token);
		let url = this.base_url+'faq/edit/'+input.id;	    
		return this.http.post(url,input, { headers: headers })
		.map((response:Response)=>{
			const data = response;
			return data;
		})
		.catch((error:Error) => {
			//console.log(error);
			return Observable.throw(error);});

	}  

	getAllpages(){ 
		let token; 
		if(sessionStorage.getItem("auth_token")!=undefined){
			token = sessionStorage.getItem("auth_token"); 
		}
		let headers = new HttpHeaders();
		headers = headers.set('Authorization', token);
		return this.http.get(this.base_url+'pagelist',{ headers: headers })
		.map((response:Response)=>{
			return response;
		})
		.catch((error:Error) => {
			return Observable.throw(error);});
	}

	deleteFaq(inputData){
		let token; 
		if(sessionStorage.getItem("auth_token")!=undefined){
			token = sessionStorage.getItem("auth_token"); 
		}
		let headers = new HttpHeaders();
		headers = headers.set('Authorization', token);
		console.log(this.base_url+'tasks/'+inputData);
		return this.http.delete(this.base_url+'faq/remove/'+inputData,{ headers: headers })
		.map((response:Response)=>{
			console.log(response);
			return response;
		})
		.catch((error:Error) => {
			return Observable.throw(error);});
	}

	getPageContent(pageId) {
		let token; 
		if(sessionStorage.getItem("auth_token")!=undefined){
			token = sessionStorage.getItem("auth_token"); 
		}
		let headers = new HttpHeaders();
		headers = headers.set('Authorization', token);
		headers.set('Content-Type', null);
		headers.set('Accept', "multipart/form-data");
		return this.http.get(this.base_url+'page/listsections/'+pageId,{ headers: headers })
		.map((response:Response)=>{
			//   console.log('team response',response);
			return response;
		})
		.catch((error:Error) => {
			console.log('error',error);
			return Observable.throw(error);});
	}

	deleteImage(id) {
	    let token; 
		if(sessionStorage.getItem("auth_token")!=undefined){
			token = sessionStorage.getItem("auth_token"); 
		}
		let headers = new HttpHeaders();
		headers = headers.set('Authorization', token); 		
		return this.http.delete(this.base_url+'image/remove/'+id,{ headers: headers })
		.map((response:Response)=>{
			console.log(response);
			return response;
		})
		.catch((error:Error) => {
			return Observable.throw(error);});
	}

	getFaqs() {
	   let token; 
		if(sessionStorage.getItem("auth_token")!=undefined){
			token = sessionStorage.getItem("auth_token"); 
		}
		let headers = new HttpHeaders();
		headers = headers.set('Authorization', token);
		return this.http.get(this.base_url+'faq/list',{ headers: headers })
		.map((response:Response)=>{
			return response;
		})
		.catch((error:Error) => {
			return Observable.throw(error);});
	}

	getFaqList() {
		return this.http.get(this.base_url+'web/faq/list')
		.map((response:Response)=>{
			return response;
		})
		.catch((error:Error) => {
			return Observable.throw(error);});
	}

	getSettings() {
		let token; 
		if(sessionStorage.getItem("auth_token")!=undefined){
			token = sessionStorage.getItem("auth_token"); 
		}
		let headers = new HttpHeaders();
		headers = headers.set('Authorization', token);
		return this.http.get(this.base_url+'websetting/adminlist',{ headers: headers })
		.map((response:Response)=>{
			return response;
		})
		.catch((error:Error) => {
			return Observable.throw(error);});
	}

	websiteSettings () {
	return this.http.get(this.base_url+'websetting/weblist')
		.map((response:Response)=>{
			return response;
		})
		.catch((error:Error) => {
			return Observable.throw(error);});
	}
} 


