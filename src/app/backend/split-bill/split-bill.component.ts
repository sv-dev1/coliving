import { Component, OnInit } from '@angular/core';
import { DataService } from '../../data.service';

@Component({
  selector: 'app-split-bill',
  templateUrl: './split-bill.component.html',
  styleUrls: ['./split-bill.component.css']
})
export class SplitBillComponent implements OnInit {
  
    bills:any;
    isError:boolean=false;
	errorsArr:string ='';

  constructor(private data_service : DataService) { }

  ngOnInit() {
  	this.getBills();
  }
  getBills(){
  	  this.data_service.getBills().subscribe((response:any) =>{   
			this.bills = response.bills;
			console.log('bills',this.bills);
			this.isError = false;    
		}, error =>{ 
			this.isError = true; 
			this.errorsArr = error.error;
		})
  }
}
