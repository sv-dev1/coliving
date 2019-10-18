import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; 
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
	base_url :any;
	userInfo:any;
  constructor(
    private http : HttpClient,
  ) { 
    this.base_url = environment.base_url;
  }

  ngOnInit() {
    this.getUserData();
  }
  getUserData(){ 
		let token; 
		if(sessionStorage.getItem("auth_token")!=undefined){
			token = sessionStorage.getItem("auth_token"); 
		}
		let headers = new HttpHeaders();
		headers = headers.set('Authorization', token);
		this.http.get(this.base_url+'user/profile', { headers: headers }).subscribe((response: any) => {
			this.userInfo = response.users[0];
          console.log(this.userInfo);
		},error=>{ 
			console.log("ERROR");
			console.log(error.error);
		});  
	}
	
}
