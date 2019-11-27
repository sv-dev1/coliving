import { Component, OnInit, HostListener } from '@angular/core';
import {  Router, } from '@angular/router';
import { FormGroup,FormBuilder,Validators } from '@angular/forms';
import { DataService } from '../data.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { ActivatedRoute } from '@angular/router';

@Component({
	selector: 'app-email-verification',
	templateUrl: './email-verification.component.html',
	styleUrls: ['./email-verification.component.css']
})
export class EmailVerificationComponent implements OnInit {

    isError : boolean = false;
	constructor(
		 	private formBuilder:FormBuilder,	
			private router: Router,
			private data_service : DataService,
			public toastr: ToastrManager,
			private route: ActivatedRoute,
		) { 

	}

	ngOnInit() {
		const parameter1 : string = this.route.snapshot.queryParamMap.get('userId');
		const parameter2 : string = this.route.snapshot.queryParamMap.get('token');
		const input_data = {
			'userId' : parameter1,
			'token': parameter2
		}
		this.data_service.verifyEmailAddress(input_data).subscribe((response:any) =>{  
	        this.toastr.successToastr(response.message, 'Success!');
	        this.router.navigate(['/thank-you']); 
	        this.isError = false;          
	     }, error =>{
	        this.isError = true;   
	        window.scrollTo(0, 0);
	        console.log('errror',error);
	       
	    })
	}
}
