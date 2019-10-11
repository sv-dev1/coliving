import { Component, OnInit } from '@angular/core';
import { DataService } from '../../data.service';
import { environment } from '../../../environments/environment';
import { DatePipe } from '@angular/common';
import { Lightbox } from 'ngx-lightbox';

@Component({
  selector: 'app-split-bill',
  templateUrl: './split-bill.component.html',
  styleUrls: ['./split-bill.component.css']
})
export class SplitBillComponent implements OnInit {
  
    bills:any=[];
    isError:boolean=false;
	  errorsArr:string ='';
    base_url:string = '';
    today:any;
    currentDate:any;
    allBills:any;
    backgroundColor:string='';
    dueDatemessage:string='';
    status: boolean = false;
    isImageModal:boolean=false;
    popImage:any;
    private _albums:any  = [];

  constructor(
          private data_service : DataService,
          private datePipe: DatePipe,
          private _lightbox: Lightbox
       ) { 
     this.base_url = environment.image_base_url;
  }

  ngOnInit() {
  	  this.getBills();
      this.today = new Date();

  }

  getBills(){
  	  this.data_service.getBills().subscribe((response:any) =>{   
			this.allBills = response.bills;
 
			this.allBills.forEach(obj =>{
        let previous_date = obj.bill.date;
        let latest_date =this.datePipe.transform(this.today, 'yyyy-MM-dd');
        if(previous_date  <  latest_date){
          this.backgroundColor = '#c3a9a333';
          this.dueDatemessage ='Bill due date is over.';
        } else {
          this.backgroundColor = '';
          this.dueDatemessage ='';
        }     
        this.bills.push({
                part: obj.amount,
                title:obj.bill.title,
                total_amount:obj.bill.amount,
                date:obj.bill.date,
                image:obj.bill.bill_Id,
                created_by:obj.bill.userProfile.firstName+' '+obj.bill.userProfile.lastName,
                color:this.backgroundColor,
                message: this.dueDatemessage
        });
    
      })
      
			this.isError = false;    
		}, error =>{ 
			this.isError = true; 
			this.errorsArr = error.error;
		})
  }

  clickEvent(){
      this.status = !this.status;       
  }

  zoomImage(imgPath){
    this.popImage = imgPath.target.currentSrc;
    this.isImageModal =true;
  }

  close() {
    this.popImage = '';
    this.isImageModal =false;

  }
}
