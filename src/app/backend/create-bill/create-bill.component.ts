import { Component, OnInit } from '@angular/core';
import {  Router } from '@angular/router';
import { FormGroup,FormBuilder,Validators} from '@angular/forms';
import { DataService } from '../../data.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-create-bill',
  templateUrl: './create-bill.component.html',
  styleUrls: ['./create-bill.component.css']
})
export class CreateBillComponent implements OnInit {
  createBillForm: FormGroup;
  submitted = false; 
  isError : boolean = false;
  isSuccess : boolean = false;
  errorsArr:any = []; 
  teamData: any;
  constructor(
    private formBuilder:FormBuilder,	
    private router: Router,
    private data_service : DataService,
    public toastr: ToastrManager
  ) { 
    this.createBillForm = this.formBuilder.group({
      team: [''],
      title: [''],
      amount: [''],
      date: [''],
      paidBy: [''],
      bill: [''],
      assign_to:['kbs']
    });
  }

  ngOnInit() {
    this.getTeam();
  }

  get f() {  
    return this.createBillForm.controls; 
  }

  createBill(){
      let data=this.createBillForm.value;
      this.submitted = true;
        if (this.createBillForm.invalid) {
          return;
        }
        else{
            const input_data = {
              
              "team" : data.team,
              "title" : data.title,      
              "amount" : data.amount,
              "date" : data.date,
              "paidBy" : data.paidBy,
              "bill" : data.bill,
              "assign_to" : data.assign_to,
            }
            const formData = new FormData();
              formData.append('title', input_data.title);
              formData.append('files', input_data.bill);	   
              formData.append('team', input_data.team);
              formData.append('amount', input_data.amount);
              formData.append('date', input_data.date);
              formData.append('userId', input_data.assign_to);   
            
            this.data_service.createBill(formData).subscribe((response:any) =>{  
                  console.log(JSON.stringify(response, undefined, 2));  
                this.toastr.successToastr('Bill created Successfully.', 'Success!');
                
            }, error =>{
                this.isError = true;   
                window.scrollTo(0, 0);
              this.errorsArr = JSON.parse(error._body);
              this.toastr.errorToastr(this.errorsArr, 'Error!');
              console.log(JSON.stringify(this.errorsArr, undefined, 2))
            })

        }      
  }

  getTeam(){
        this.data_service.getTeam().subscribe((response:any) =>{  
          this.teamData=response.teams;
          console.log(this.teamData);
      //  this.toastr.successToastr('Bill created Successfully.', 'Success!');
          this.createBillForm = this.formBuilder.group({
            team: [''],
            title: [''],
            amount: [''],
            date: [''],
            paidBy: [''],
            bill: [''],
            assign_to:[this.teamData.userId]
          });
    }, error =>{
        this.isError = true;   
        window.scrollTo(0, 0);
      this.errorsArr = JSON.parse(error._body);
      this.toastr.errorToastr(this.errorsArr, 'Error!');
      console.log(JSON.stringify(this.errorsArr, undefined, 2))
    })
  }

  onTeamSelection(checkedVal) { 
     console.log(checkedVal);
    if(checkedVal != ''){
   // console.log(checkedVal);
    // let postArr = {'teamId': checkedVal};
    // this.data_service.getTeamUsers(postArr).subscribe((response:any) =>{  
    //      console.log(response);  
    // //   this.toastr.successToastr('Bill created Successfully.', 'Success!');
        
    // }, error =>{
    //     this.isError = true;   
    //     window.scrollTo(0, 0);
    //   this.errorsArr = JSON.parse(error._body);
    //   this.toastr.errorToastr(this.errorsArr, 'Error!');
    //   console.log(JSON.stringify(this.errorsArr, undefined, 2))
    // })
    // console.log("Checkbox Checked");
     }
    
  }

}
