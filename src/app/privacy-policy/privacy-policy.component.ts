import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-privacy-policy',
	templateUrl: './privacy-policy.component.html',
	styleUrls: ['./privacy-policy.component.css']
})
export class PrivacyPolicyComponent implements OnInit {
	currentYear: any ;
	session_key: boolean = false;
	constructor() { }

	ngOnInit() {
		document.body.scrollTop = 0;

		var d = new Date();
		this.currentYear = d.getFullYear();

		if(sessionStorage.getItem("auth_token") != undefined){
			this.session_key = true;
		}
		
	}

}
