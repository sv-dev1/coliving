import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup,FormBuilder,Validators,FormControl,FormArray } from '@angular/forms';
import { DataService } from '../../data.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders,HttpClientModule } from '@angular/common/http'; 

@Component({
  selector: 'app-feedbackpage',
  templateUrl: './feedbackpage.component.html',
  styleUrls: ['./feedbackpage.component.css']
})
export class FeedbackpageComponent implements OnInit {
  modelOpen:boolean=false;
  isError : boolean = false;
  errorsArr : string = '';
  feedbackList:any=[];
  isArrayLength : boolean = false;
  p : any;
  fbform: FormGroup;
  url: any;
  submitted:boolean=false;
  base_url : any;

  constructor(	private formBuilder:FormBuilder,
		private router: Router,
		public toastr: ToastrManager,
		private data_service : DataService,
		private http : HttpClient) {
      this.fbform = this.formBuilder.group({
        title: ['', Validators.required],
        authorName: ['', Validators.required],
        authorAddress: ['', Validators.required],
        rating: ['', Validators.required],
        description: ['', Validators.required],
        image:['']
      });
      this.base_url = environment.base_url;

     }

  ngOnInit() {
    this.getfeedbackList();
  }
  openAddCategoryModal(){
       this.modelOpen=true;
  }
  closeModal(){
    this.modelOpen=false;
  }
  getfeedbackList(){
    this.data_service.getFeedback().subscribe((response:any) =>{   
       this.feedbackList=response.HappyResidentsDetails;
       console.log(this.feedbackList);
       if(this.feedbackList.length > 10 ) {
        this.isArrayLength  = true;
      }
      this.isError = false;    
    }, error =>{ 
      this.isError = true; 
      this.errorsArr = error.error;
    })
  }
  addFeedback(formValue){
    this.submitted=true;
      if(this.fbform.invalid){
         return;
      }
      else{
        console.log(this.fbform.value);
        const formData = new FormData();
				formData.append('title', formValue.title);
				formData.append('authername', formValue.authorName);
				if(this.url){
						formData.append('image',this.url );
				}			
				formData.append('autheraddress', formValue.authorAddress);
				formData.append('rating', formValue.rating);
				formData.append('description', formValue.description);

				let token; 
				if(sessionStorage.getItem("auth_token")!=undefined){
					token = sessionStorage.getItem("auth_token"); 
				}
				const httpOptions = { headers: new HttpHeaders({'authorization': token })};
				this.http.post(this.base_url+'hr/addhr', formData, httpOptions).subscribe((response:any) => {
          
          this.toastr.successToastr(response.message,'Success');
          this.modelOpen=false;
					this.submitted = false;
				},error =>{
					this.isError = true;
					this.toastr.errorToastr(error.error.status,'Error');
					this.errorsArr = error.error;
				
				});
      }
  }
  get f() { return this.fbform.controls; }

  onSelectFile(event) { // called each time file input changes
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event) => { // called once readAsDataURL is completed
        this.url = reader.result;
      }
    }
}

}
