import { Component, OnInit } from '@angular/core';
import { DataService } from '../../data.service';
import { FormGroup,FormBuilder,Validators,FormControl,FormArray } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
	profiles:any;
  url = '';

  constructor(private data_service : DataService,private formBuilder:FormBuilder,) { }

  ngOnInit() 
  {
  	this.getUserData();
  }

   getUserData(){ 
  	this.data_service.getUserData().subscribe((response:any)=> {      
    this.profiles = response.users[0];    
    console.log(this.profiles);       
    },error =>{
      console.log(error);    
    });  		
   }	 

   onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event) => { // called once readAsDataURL is completed
       // this.url = event.target.result;
        this.url = (event.target as any).result; 

      }
    }
  }
   public delete(){
    this.url = null;
  }

}


