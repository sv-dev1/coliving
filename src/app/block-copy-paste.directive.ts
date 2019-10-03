import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appBlockCopyPaste]'
})
export class BlockCopyPasteDirective {
   messagePaste:boolean = false;
   messageCopy:boolean = false;
   messageCut:boolean = false;
   messagetxt:string='';

  constructor() { }
   @HostListener('paste', ['$event']) blockPaste(e: KeyboardEvent) {
   	this.messagetxt = 'Paste text not allowed in this field';
   	this.messagePaste = true;
   	this.messageCopy = false;
   	this.messageCut = false;
    e.preventDefault();
    return this.messagetxt;
  }

  @HostListener('copy', ['$event']) blockCopy(e: KeyboardEvent) {
  	this.messagetxt = 'Copy text not allowed in this field';
    this.messagePaste = false;
   	this.messageCopy = true;
   	this.messageCut = false;  
   	console.log('sfsdfsdfsd',this.messagetxt);
    e.preventDefault();
  }

  @HostListener('cut', ['$event']) blockCut(e: KeyboardEvent) {
  	this.messagetxt = 'Cut text not allowed in this field';
   	this.messagePaste = false;
   	this.messageCopy = false;
   	this.messageCut = true;  
   	console.log('sfsdfsdfsd',this.messagetxt);
    e.preventDefault();
  }
   @HostListener('keydown', ['$event'])
    public onKeydownHandler(e: KeyboardEvent): void {
    if(e.keyCode===13){
     // alert("enter")
    }
    }
}
