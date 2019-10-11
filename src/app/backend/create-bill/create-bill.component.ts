import { Component, OnInit } from '@angular/core';
import {  Router } from '@angular/router';
import { FormGroup,FormBuilder,Validators} from '@angular/forms';
import { DataService } from '../../data.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { first } from 'rxjs/operators';
import {DatePipe} from '@angular/common';
import { HttpClient, HttpHeaders,HttpClientModule } from '@angular/common/http'; 
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-create-bill',
  templateUrl: './create-bill.component.html',
  styleUrls: ['./create-bill.component.css']
})
export class CreateBillComponent implements OnInit {
  createBillForm: FormGroup;
  submitted : boolean = false; 
  isError : boolean = false;
  isSuccess : boolean = false;
  errorsArr:any = []; 
  teamData: any;
  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};
  userdropdownList = [];
  userselectedItems = [];
  userdropdownSettings={};
  teamuser: any;
  fileData:any;
  base_url : string = "";
  teamName: any = [];
  assignUser: any=[];
  teamEmpty:boolean=false;
  userEmpty:boolean=false;
  selectEmpty:boolean=false;
  list : any =[];
  url:any;

  constructor(
    private formBuilder:FormBuilder,	
    private router: Router,
    private data_service : DataService,
    public toastr: ToastrManager,
    private datePipe: DatePipe,
    private http : HttpClient,
  ) { 
    this.createBillForm = this.formBuilder.group({
        team: ['', Validators.required], 
        title: ['', Validators.required],
        amount: ['', Validators.required],
        date:['', Validators.required],
        bill:['', Validators.required],
        assign_to:['', Validators.required]
    });
    this.base_url = environment.base_url;

  }

  ngOnInit() {
    this.getTeam();
  }

  get f() {  
    return this.createBillForm.controls; 
  }
  onSelectFile(event) {
		 this.fileData = event.target.files[0];   
     this.preview();
  } 
  preview() {
    var mimeType = this.fileData.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    var reader = new FileReader();      
    reader.readAsDataURL(this.fileData); 
    reader.onload = (_event) => { 
     this.url = reader.result; 
    }
  }
  createBill(){
    
      if(this.createBillForm.value['team']=="")
      {
        this.teamEmpty=true;
      }
      if(this.createBillForm.value['assign_to']=="")
      {
        this.userEmpty=true;
      }
      this.submitted = true;
        if (this.createBillForm.invalid) {
          return;
        }
        else{
          let data=this.createBillForm.value;
          // console.log(data.team);
            data.team.forEach(element => {
                this.teamName.push(element.id);
            });
            data.assign_to.forEach(element => {
              this.assignUser.push(element.id);
            });
            const input_data = {
              "team" : data.team,
              "title" : data.title,      
              "amount" : data.amount,
              "date" : this.datePipe.transform(data.date, 'yyyy-MM-dd'),
              "bill" : this.fileData,
              "assign_to" : data.assign_to
            }
            const formData = new FormData();
            formData.append('title', input_data.title);
            formData.append('files', this.fileData);	   
            formData.append('team', this.teamName);
            formData.append('amount', input_data.amount);
            formData.append('date', input_data.date);
            formData.append('userId', this.assignUser);   
            let token; 
            if(sessionStorage.getItem("auth_token")!=undefined){
            token = sessionStorage.getItem("auth_token"); 
            }
            const httpOptions = { headers: new HttpHeaders({'authorization': token })};
            this.http.post(this.base_url+'createBills', formData, httpOptions).subscribe((response:any) => {
                
                this.toastr.successToastr(response.message, 'Success!');
                this.submitted=false;
                this.createBillForm.reset();
              },error=>{ 
                //console.log("ERROR");
                //console.log(error.error);
                console.log('error', error);
            }); 
        }
  }

  getTeam(){        
        this.data_service.getTeam().subscribe((response:any) =>{  
          this.teamData=response['teams'];
         // console.log(this.teamData);
          this.teamData.forEach(ele => {
            let obj = {};
            obj['id'] = ele['teamId'];
            obj['itemName'] = ele['name'];
            this.dropdownList.push(obj);
          });
        //  console.log(this.dropdownList);
          // for(let i=0; i < this.teamData.length; i++) {
          //   this.dropdownList.push({ "id": this.teamData[i]['teamId'], "itemName": this.teamData[i]['name'] });
          // }
          this.dropdownSettings = { 
             singleSelection: false, 
             text:"Select Team",
             selectAllText:'Select All',
             unSelectAllText:'UnSelect All',
             classes:"myclass custom-class"
          };
    }, error =>{
        this.isError = true;   
        window.scrollTo(0, 0);
      this.errorsArr = JSON.parse(error._body);
      this.toastr.errorToastr(this.errorsArr, 'Error!');
      //console.log(JSON.stringify(this.errorsArr, undefined, 2))
    })
  }

  onTeamSelection() { 
    let tmp = [];
    let postArr = {'teamId': this.list};
   // console.log(postArr);
    this.data_service.getTeamUsers(postArr).subscribe((response:any) =>{  
         this.teamuser=response.teams;
         for(let i=0; i < this.teamuser.length; i++) {
         if(this.teamuser[i].userProfile){
             tmp.push({ id: this.teamuser[i].userProfile['userId'], itemName: this.teamuser[i].userProfile['firstName']});
        }}
        this.userdropdownList = tmp;
        this.userdropdownSettings = { 
          singleSelection: false, 
          text:"Select User",
          selectAllText:'Select All',
          unSelectAllText:'UnSelect All',
          classes:"myclass custom-class"
       };
    }, error =>{
        this.isError = true;   
        window.scrollTo(0, 0);
      this.errorsArr = JSON.parse(error._body);
      this.toastr.errorToastr(this.errorsArr, 'Error!');
     // console.log(JSON.stringify(this.errorsArr, undefined, 2))
    })
  
  }
  onItemSelect(item:any){
    this.list.push(item['id']);
    this.onTeamSelection();
    }
  OnItemDeSelect(item:any){
    this.list.splice(this.list.indexOf(this.list), 1);
    this.onTeamSelection();
  }
  onSelectAll(items: any){
    items.forEach(element => {
       this.list.push(element['id']);
     });
    this.onTeamSelection();
  }
  onDeSelectAll(items: any){
      //console.log(items);
      this.list=[];
      this.onTeamSelection();
  }
  onUserSelectAll(items: any){
    this.userselectedItems.push(items);
    //console.log(this.userselectedItems);
  } 
  onUserItemSelect(item:any){
      this.userselectedItems.push(item);
      //console.log(this.userselectedItems);
  }
  OnUserItemDeSelect(item:any){
    //console.log(this.userselectedItems);
  }
  onUserDeSelectAll(items: any){
     // console.log(items);
  }
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }
}
