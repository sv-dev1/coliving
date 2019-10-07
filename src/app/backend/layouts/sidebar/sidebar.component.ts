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

	constructor(private router: Router,
		private route: ActivatedRoute
		) { 
		   this.param1 = this.route.snapshot.params.p1; 
		}
    ngOnInit() {

  	       if(this.router.url == '/task-suggestions/'+this.param1){
           this.isHouse = true;
          }
    }
}
