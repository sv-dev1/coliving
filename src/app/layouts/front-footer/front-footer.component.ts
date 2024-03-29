import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup,FormBuilder,Validators,FormControl,FormArray } from '@angular/forms';
import { DataService } from '../../data.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders,HttpClientModule } from '@angular/common/http';
import { ViewportScroller } from '@angular/common';
@Component({
  selector: 'app-front-footer',
  templateUrl: './front-footer.component.html',
  styleUrls: ['./front-footer.component.css']
})
export class FrontFooterComponent implements OnInit {
  
    isError : boolean = false ;
    errorsArr : any = [] ;
    settingArray : any = [] ;

  constructor(private formBuilder:FormBuilder,
		private router: Router,
		public toastr: ToastrManager,
		private data_service : DataService,
		private http : HttpClient,
    private vps: ViewportScroller,
    ) { }

  ngOnInit() {
  	this.websiteSettings();
    this.getTarget();
  }

   websiteSettings() {
  	 	this.data_service.websiteSettings().subscribe((response:any) =>{   
     		this.settingArray = response.settings[0];
     		
            this.isError = false;    
     	}, error =>{ 
     		this.isError = true; 
     		this.errorsArr = error.error;
     	})
  }

  getTarget(){
    this.data_service.currentTarget.subscribe(response =>{
      if(response){
        console.log(response);
        if(response == 'contact'){
          this.vps.scrollToAnchor('contact');
        }
      }
    },error =>{
      console.log(error);
    })
  }  
  
}
