import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'safeHtml'
})
export class escapeHtmlPipe implements PipeTransform {
  
  constructor(private sanitizer:DomSanitizer){}

  transform(value: any): any {
    if(value){
      return value.split('&lt;').join('<').split('&gt;').join('>').split('&quot;').join('"').split('&#39;').join("'").split('&amp;').join('&').split('&#x2F;').join('/');
    }
  }
}


