import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent implements OnInit {

  classList: any;
  nextElementSibling: any;
  currentYear: any ;
  session_key: boolean = false;
  
  constructor() { }

  ngOnInit() {
    var d = new Date();
    this.currentYear = d.getFullYear();
    const items = document.querySelectorAll(".accordion a");
    document.body.scrollTop = 0;

    if(sessionStorage.getItem("auth_token") != undefined){
      this.session_key = true;
    } 
  }

  toggleAccordion(){
    this.classList.toggle('active');
    this.nextElementSibling.classList.toggle('active');
  }
} 
