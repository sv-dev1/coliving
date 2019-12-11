import {
	Component,
	OnInit,
	HostListener
} from '@angular/core';
import {
	Router,
} from '@angular/router';
import {
	FormGroup,
	FormBuilder,
	Validators
} from '@angular/forms';
import {
	DataService
} from '../data.service';
import {
	ToastrManager
} from 'ng6-toastr-notifications';

@Component({
	selector: 'app-contact-us',
	templateUrl: './contact-us.component.html',
	styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent implements OnInit {

	contactUsForm: FormGroup;
	submitted = false;
	fagree = false;
	msg = '';
	isError: boolean = false;
	isSuccess: boolean = false;
	errorsArr: any = [];
	errorsArrUser: any = [];

	constructor(
		private formBuilder: FormBuilder,
		private router: Router,
		private data_service: DataService,
		public toastr: ToastrManager,
	) {
		this.contactUsForm = this.formBuilder.group({
			name: ['', Validators.required],
			email: ['', [Validators.required, Validators.email]],
			subject: ['', Validators.required],
			message: ['', Validators.required]
		});
	}

	ngOnInit() {

	}
    get f() {  
	    return this.contactUsForm.controls; 
	}
	contactUs(formValue) {
       this.submitted = true;
	    if (this.contactUsForm.invalid) {
	      return;
	    }else{
          //console.log('formValue', formValue);
	    }

	}

}