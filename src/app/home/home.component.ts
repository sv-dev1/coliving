import { Component, OnInit } from '@angular/core';
import { FormGroup,FormBuilder,Validators,FormControl,FormArray } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

   subscribeForm: FormGroup;

  constructor(
     private formBuilder:FormBuilder
  ) {
       this.subscribeForm = this.formBuilder.group({
	     
    });
   }

  ngOnInit() {
  }

}
