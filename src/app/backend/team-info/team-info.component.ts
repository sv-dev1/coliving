import { Component, OnInit } from '@angular/core';
import { DataService } from '../../data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-team-info',
  templateUrl: './team-info.component.html',
  styleUrls: ['./team-info.component.css']
})
export class TeamInfoComponent implements OnInit {
  teamUser: any= [];
  list: any= [];
  teamId: any;
  image_base_url:any;
  ShowInfo:boolean=false;
  constructor(
    private data_service : DataService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    if(sessionStorage.getItem("roleId") == '1' || sessionStorage.getItem("roleId") == '3' || sessionStorage.getItem("roleId") == '4'){
          this.router.navigate(['/']);
     }
    this.route.params.subscribe(params => {
     this.teamId = params['id'].replace(/\:/g,"");
    });
   this.openUser();
   this.image_base_url = environment.image_base_url;

  }
  openUser(){
    this.teamUser=[];
    this.list=[]
    this.list.push(this.teamId);
    let postArr = {'teamId': this.list};
    this.data_service.getTeamUsers(postArr).subscribe((response: any) =>{
    this.teamUser=[];
    let team=[];
      team=response.teams;
      for(var i=0;i < team.length;i++){
        if(response.teams[i]['userProfile'] != null){
        this.teamUser.push(response.teams[i]);
       }
      }
      console.log(this.teamUser);
     })
 
  }
  userInfo(){
    this.ShowInfo=true;
  }
  
}
