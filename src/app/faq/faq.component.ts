import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup,FormBuilder,Validators,FormControl,FormArray } from '@angular/forms';
import { DataService } from '../data.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders,HttpClientModule } from '@angular/common/http'; 

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent implements OnInit {

  classList : any;
  nextElementSibling : any;
  currentYear : any ;
  session_key : boolean = false;
  allFaqList : any =[];
  allFaqListnew : any =[];
  isError : boolean = false;
  errorsArr : any;
  isShow : string = '';
  areaExpand : string = '';
  collapsed : string = '';
  
  constructor(
    private formBuilder:FormBuilder,
    private router: Router,
    public toastr: ToastrManager,
    private data_service : DataService,
    private http : HttpClient) { }

  ngOnInit() {
    var d = new Date();
    this.currentYear = d.getFullYear();
    const items = document.querySelectorAll(".accordion a");
    document.body.scrollTop = 0;

    if(sessionStorage.getItem("auth_token") != undefined){
      this.session_key = true;
    } 
    this.getFaqList();
  }

  toggleAccordion(){
    this.classList.toggle('active');
    this.nextElementSibling.classList.toggle('active');
  }

  getFaqList() {
    this.data_service.getFaqList().subscribe((response:any) =>{ 
      this.allFaqList = response.faqDetails;
      let i = 1 ;
     
      this.allFaqList.forEach(element => {
            if(i == 1 ){
              this.isShow = 'show';
              this.areaExpand = 'true';
              this.collapsed = '';
           } else {
             this.isShow = '';
             this.areaExpand = 'false';
             this.collapsed = 'collapsed';

           }
        this.allFaqListnew.push({ 
          'areaExpand' : this.areaExpand,
          'collapsed' : this.collapsed,
          'isShow' : this.isShow,
          'title': element.question, 
          'description': element.description,
          'index': this.inWords(i)
          
        });
         i++;
      });
      console.log('this.allFaqListnew', this.allFaqListnew);
      this.isError = false;    
    }, error =>{ 
      this.isError = true; 
      this.errorsArr = error.error;
    })
  }

   capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
   }
  inWords (num) {
    let n;
    var a = ['','One','Two','Three','four', 'five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'];
    var b = ['', '', 'twenty','thirty','forty','fifty', 'sixty','seventy','eighty','ninety'];

      if ((num = num.toString()).length > 9) return 'overflow';
      n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
      if (!n) return; var str = '';
      str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'crore ' : '';
      str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'lakh ' : '';
      str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'thousand ' : '';
      str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'hundred ' : '';
      str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]])  : '';
      return str;
  }
} 
