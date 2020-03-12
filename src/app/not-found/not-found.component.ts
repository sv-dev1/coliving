import { Component, OnInit } from '@angular/core';
import { Observable, interval, Subscription } from 'rxjs';
import { map } from 'rxjs/operators'
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent implements OnInit {

   private goToHomePage: Subscription;

  constructor( 
  	         private router: Router
  	         ) {
  	      }

  ngOnInit() {
  	/* this.goToHomePage = interval(30000).subscribe(
        (val) => { 
        	this.router.navigate(['/']);
      });*/
  }
}
