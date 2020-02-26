import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup,FormBuilder,Validators,FormControl,FormArray } from '@angular/forms';
import { DataService } from '../../data.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders,HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit {


 feedbacks : any = [];
 feedbacksCount:  any; 
 isArrayLength : boolean = false;
 isError : boolean = false;
 errorsArr : any = [];

  constructor(private formBuilder:FormBuilder,
		private router: Router,
		private route: ActivatedRoute,
		public toastr: ToastrManager,
		private data_service : DataService,
		private http : HttpClient) { }

  ngOnInit() {
  		this.getFeedbacks();
  }
   	getFeedbacks() {
		this.data_service.getFeedbacks().subscribe((response:any) =>{ 
			this.feedbacks = response.pagesArr.sections;
			console.log('this.pageContent', this.feedbacks);
			this.feedbacksCount = this.feedbacks.length;
			if(this.feedbacksCount > 10) {
				this.isArrayLength = true;
			}
			this.isError = false;    
		}, error =>{ 
			this.isError = true; 
			this.errorsArr = error.error;
		})
	}
}
