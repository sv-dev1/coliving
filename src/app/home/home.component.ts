import { Component, OnInit, ViewChild, Input,SecurityContext } from '@angular/core';
import { FormGroup,FormBuilder,Validators,FormControl,FormArray } from '@angular/forms';
import Typewriter from 't-writer.js';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { HttpClient, HttpHeaders,HttpClientModule } from '@angular/common/http'; 
import { ToastrManager } from 'ng6-toastr-notifications';
import { environment } from '../../environments/environment';
import { DomSanitizer,SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
 animations: [
    trigger('fade', [ 
      transition('void => *', [
        style({ opacity: 0 }), 
        animate(2000, style({opacity: 1}))
      ]) 
    ])
  ]
})
export class HomeComponent implements OnInit {

  subscribeForm : FormGroup;
  session_key : boolean = false;
  currentYear : any ;
  roleId : string = '';
	base_url : string = "";
  infoData:any;
  section2:any;
  section3:any;
  section4:any;
  section5:any;
  section6:any;
  section7:any;
  section8:any;
  image_base_url:any;
  htmlStr = "&lt;strong&gt;News Body&lt;/strong&gt;";

  @Input() currentState;
  @ViewChild('tw', null) typewriterElement;
  @ViewChild('tw2', null) typewriterElement2;
  @ViewChild('tw3', null) typewriterElement3;

  constructor(
    private formBuilder:FormBuilder,
    public toastr: ToastrManager,
    private http : HttpClient,
    private _sanitizer: DomSanitizer
    ) {
    this.subscribeForm = this.formBuilder.group({
           
    });
    this.base_url = environment.base_url;
    this.image_base_url = environment.image_base_url;

  }

  ngOnInit() {
    
    var d = new Date();
    this.currentYear = d.getFullYear();

    if(sessionStorage.getItem("auth_token") != undefined){
      this.session_key = true;
      this.roleId = sessionStorage.getItem('roleId');
    } 
    this.getContent();
  }
  
  subscribe(value) {
  }

  getContent(){
   
    this.http.get(this.base_url+'page/home').subscribe((response:any) => {
      this.infoData=response.pagesArr['sections'][0];
      this.section2=response.pagesArr['sections'][1];
      this.section3=response.pagesArr['sections'][2];
      this.section4=response.pagesArr['sections'][3];
      this.section5=response.pagesArr['sections'][4];
      this.section6=response.pagesArr['sections'][5];
      this.section7=response.pagesArr['sections'][6];
      this.section8=response.pagesArr['sections'][7];
       console.log(response.pagesArr['sections']);
    },error=>{ 
        console.log(error);
        });
  }
  getData(data){
   // var result=data.replace(/\&lt;p\&gt;(?:\s|\&amp;nbsp;)*\&lt;\/p\&gt;/gi,"");
    console.log(data);
      return data;
  }
  
}
