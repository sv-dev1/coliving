import { Component, OnInit } from '@angular/core';
import { FormGroup,FormBuilder,Validators,FormControl,FormArray } from '@angular/forms';


@Component({
  selector: 'app-occupation',
  templateUrl: './occupation.component.html',
  styleUrls: ['./occupation.component.css']
})
export class OccupationComponent implements OnInit {
	ADDForm : FormGroup; 
	EDITForm : FormGroup;
	ADDoccupation : boolean = false;
	EDIToccupation : boolean = false; 
	DELETEoccupation : boolean = false; 
	submitted : boolean =false;



 constructor(private formBuilder:FormBuilder,) {
 this.ADDForm = this.formBuilder.group({       
	occupation_name:['', Validators.required], 
	occupation_desc: ['', Validators.required]
});

this.EDITForm = this.formBuilder.group({       
	edit_occupation_name:['', Validators.required], 
	edit_occupation_desc: ['', Validators.required]
});
} 

  ngOnInit() {}

get f() { return this.ADDForm.controls; }
get Ef() { return this.EDITForm.controls; }

ADDoccu(form){
	this.submitted = true;
	if(this.ADDForm.invalid) {
	return;
	}else{
	const input = {       
	"name": form.occupation_name, 
	"description": form.occupation_desc,       
	}   
	console.log(input);       
    }
}

ADDModal()
{
	this.ADDoccupation = true;    
}
closeModal()
{
	this.ADDoccupation = false;
	this.submitted = false;     
	this.ADDForm.reset();
}

EDIToccu(form){
	this.submitted = true;
	if(this.EDITForm.invalid) {
	return;
	}else{
	const input = {       
	"name": form.edit_occupation_name, 
	"description": form.edit_occupation_desc,       
	}   
	console.log(input);       
	}
}

EDITModal()
{   
	this.EDIToccupation = true;

}
closeModal1()
{
	this.EDIToccupation = false;
    this.submitted = false;     
	this.EDITForm.reset();
}

deleteOccupation(){
	
}

DELETEModal()
{
    this.DELETEoccupation = true;

}
closeModal2()
{
	this.DELETEoccupation = false;
	this.submitted = false; 	
}

}

