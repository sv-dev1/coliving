import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders,HttpClientModule } from '@angular/common/http'; 
import { environment } from '../../environments/environment';

@Component({
	selector: 'app-privacy-policy',
	templateUrl: './privacy-policy.component.html',
	styleUrls: ['./privacy-policy.component.css']
})
export class PrivacyPolicyComponent implements OnInit {
	currentYear: any ;
	session_key: boolean = false;
	base_url : string = "";
	
	section1:any;
	section2:any;
	section3:any;
	section4:any;
	section5:any;
	section6:any;
	section7:any;
	section8:any;
	section9:any;
	section10:any;
	section11:any;
	section12:any;
	section13:any;
	section14:any;
	section15:any;
	section16:any;
	section17:any;
	section18:any;
	section19:any;
	section20:any;
	section21:any;
	section22:any;
	constructor(
		private http : HttpClient,
	 ) {
		this.base_url = environment.base_url;
	 }

	ngOnInit() {
		this.getContent();
		document.body.scrollTop = 0;

		var d = new Date();
		this.currentYear = d.getFullYear();

		if(sessionStorage.getItem("auth_token") != undefined){
			this.session_key = true;
		}
		
	}
	getContent(){
   
		this.http.get(this.base_url+'page/privacy-policy').subscribe((response:any) => {
		
		   console.log(response.pagesArr['sections']);
		   this.section1=response.pagesArr['sections'][0];
		   this.section2=response.pagesArr['sections'][1];
		   this.section3=response.pagesArr['sections'][2];
		   this.section4=response.pagesArr['sections'][3];
		   this.section5=response.pagesArr['sections'][4];
		   this.section6=response.pagesArr['sections'][5];
		   this.section7=response.pagesArr['sections'][6];
		   this.section8=response.pagesArr['sections'][7];
		   this.section9=response.pagesArr['sections'][8];
		   this.section10=response.pagesArr['sections'][9];
		   this.section11=response.pagesArr['sections'][10];
		   this.section12=response.pagesArr['sections'][11];
		   this.section13=response.pagesArr['sections'][12];
		   this.section14=response.pagesArr['sections'][13];
		   this.section15=response.pagesArr['sections'][14];
		   this.section16=response.pagesArr['sections'][15];
		   this.section17=response.pagesArr['sections'][16];
		   this.section18=response.pagesArr['sections'][17];
		   this.section19=response.pagesArr['sections'][18];
		   this.section20=response.pagesArr['sections'][19];
		   this.section21=response.pagesArr['sections'][20];
		   this.section22=response.pagesArr['sections'][21];

		},error=>{ 
			console.log(error);
		});
	  }
}
