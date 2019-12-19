import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent implements OnInit {
 
 classList: any;
 nextElementSibling: any;
  constructor() { }

  ngOnInit() {
     window.scrollTo(0,0);
  	 const items = document.querySelectorAll(".accordion a");
  }

  toggleAccordion(){
	  this.classList.toggle('active');
	  this.nextElementSibling.classList.toggle('active');
	}
} 
