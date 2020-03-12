import { Component, OnInit } from '@angular/core';
import { Router , ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
    param1 : string = '';
	  isHouse : boolean = false;
    isMyAccount : boolean = false;
    isBills : boolean = false;
    status : boolean = false;
    roleId : string = '';

	constructor(private router: Router,
		private route: ActivatedRoute
		) { 
		   this.param1 = this.route.snapshot.params.p1; 
		}
    ngOnInit() {
           this.roleId = sessionStorage.getItem('roleId');
           
  	       if(this.router.url == '/task-suggestions/'+this.param1){
            this.isHouse = true;
            }
            if(this.router.url == '/my-account'){
               this.isMyAccount = true;
            }
            if(this.router.url == '/create-bill'){
              this.isBills = true;
            }
    }
    toggleClassOnImageClick(event:any) {
 
      if(event == false) {
          this.status = true;
          const body = document.getElementsByTagName('body')[0];
          body.classList.add('custom-body-class');
      } else if(event ==true) {
          this.status = false;
          const body = document.getElementsByTagName('body')[0];
          body.classList.remove('custom-body-class');
      }
       
   }
}
