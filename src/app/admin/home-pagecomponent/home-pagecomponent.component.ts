import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup,FormBuilder,Validators,FormControl,FormArray } from '@angular/forms';
import { DataService } from '../../data.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders,HttpClientModule } from '@angular/common/http'; 
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
	selector: 'app-home-pagecomponent',
	templateUrl: './home-pagecomponent.component.html',
	styleUrls: ['./home-pagecomponent.component.css']
})
export class HomePagecomponentComponent implements OnInit {

	constructor(
			private formBuilder:FormBuilder,
			private router: Router,
			public toastr: ToastrManager,
			private data_service : DataService,
			private http : HttpClient
		) { }

	ngOnInit() {
		/*if(sessionStorage.getItem("roleId") != '1'){
			this.router.navigate(['/dashboard']);
		}*/
	}

}
