import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent implements OnInit {

  constructor(
        private router: Router,
  	) { }

  ngOnInit() {
  	 if(sessionStorage.getItem("roleId") == '3' || sessionStorage.getItem("roleId") == '4'){
		      this.router.navigate(['/dashboard']);
		 }
  }

}
