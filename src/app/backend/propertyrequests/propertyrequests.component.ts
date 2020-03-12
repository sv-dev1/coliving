import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup,FormBuilder,Validators,FormControl,FormArray } from '@angular/forms';
import { DataService } from '../../data.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders,HttpClientModule } from '@angular/common/http';


@Component({
  selector: 'app-propertyrequests',
  templateUrl: './propertyrequests.component.html',
  styleUrls: ['./propertyrequests.component.css']
})
export class PropertyrequestsComponent implements OnInit {

  constructor(
  	        private formBuilder:FormBuilder,
			private router: Router,
			public toastr: ToastrManager,
			private data_service : DataService,
			private http : HttpClient
		) { }

  ngOnInit() {
  		 if(sessionStorage.getItem("roleId") == '1' || sessionStorage.getItem("roleId") == '3' || sessionStorage.getItem("roleId") == '4'){
			this.router.navigate(['/']);
	    }
  }

}
