import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup,FormBuilder,Validators,FormControl,FormArray } from '@angular/forms';
import Typewriter from 't-writer.js';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  subscribeForm: FormGroup;
  session_key:boolean=false;

  @ViewChild('tw', null) typewriterElement;
  @ViewChild('tw2', null) typewriterElement2;
  @ViewChild('tw3', null) typewriterElement3;

  constructor(
    private formBuilder:FormBuilder
    ) {
    this.subscribeForm = this.formBuilder.group({
           
    });
  }
  ngOnInit() {
    
    if(sessionStorage.getItem("auth_token") != undefined){
      this.session_key = true;
    } 

    const target2 = this.typewriterElement2.nativeElement;
    const target3 = this.typewriterElement3.nativeElement;
    const target = this.typewriterElement.nativeElement

    const writer = new Typewriter(target, {
      loop: true,
      typeColor: 'white',
      typeSpeed: 90,
    });

    writer
      .type(`Without washing the brush`)
      .rest(500)
      .clear()

    const writer2 = new Typewriter(target2, {
      typeColor: 'white',
      typeSpeed: 90,
    })

    const writer3 = new Typewriter(target3, {
      typeColor: 'white',
      typeSpeed: 90,
    })

   writer2
  .type('')
  .removeCursor()
  .then(writer3.start.bind(writer3))
  .start()
    writer3
      .type("FIND AND BOOK ROOMS")
      .rest(500)
      .clear()
      .changeTypeColor('white')
      .type("SAVE MONEY BY SHARING HOMES")
      .rest(500)
      .clear()
      .changeTypeColor('white')
      .type("")
      .rest(500)
      .clear()
      .changeTypeColor('white')
      .then(writer2.start.bind(writer2))
     }


  
  subscribe(value) {

  }
}
