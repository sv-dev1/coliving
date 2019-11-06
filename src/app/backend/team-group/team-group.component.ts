import { Component, OnInit } from '@angular/core';
import {  Router } from '@angular/router';
import { FormGroup,FormBuilder,Validators} from '@angular/forms';
import { DataService } from '../../data.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { first } from 'rxjs/operators';
import { Socket } from 'ng-socket-io';
declare var jsPDF: any;

@Component({
  selector: 'app-team-group',
  templateUrl: './team-group.component.html',
  styleUrls: ['./team-group.component.css']
})
export class TeamGroupComponent implements OnInit {
    showCreate:boolean=false;
    hideCreate:boolean=false;
    createTeamForm: FormGroup;
    submitted = false; 
    isError : boolean = false;
    isSuccess : boolean = false;
    errorsArr:any = []; 
    teamData: any;
    users: any;
    usersId:any = []; 
    IsContinue : boolean = false;
    Isrequired : boolean = false;
    selectedButton = {}
    hide : boolean = true;
    selectUser : boolean = false;
    validationMessage:string = '';
    completed : boolean = false;
    allTeam: any =[];
    teamArr : any =[];
    list:any=[];
    openUserModel : boolean = false;
    teamUser:any=[];
    teamLength:number = 0;
    moreTeam:boolean=false;
    socket_url:string = '';
    data:any=[];
    team_id : string = "";
    user_id : string = "";
    nickname: string = "";
    logged_in_username : string = "";
    logged_in_id : string = "";
    valMessage: boolean = false;
    indexCheck = 0;
    firstTeam:any;
    by_default_team : any = [];
    gruopMessages : any = [];
    status: boolean = false;
    message: string = "";
   teamRecord:any=[];

    constructor(
      private formBuilder:FormBuilder,  
      private router: Router,
      private data_service : DataService,
      public toastr: ToastrManager,   private socket: Socket, 

    ) { 
     
     this.createTeamForm = this.formBuilder.group({
           name:['', [Validators.required, Validators.pattern(/^\S*$/)]],
     });
      this.socket.connect(); 
       this.logged_in_id = sessionStorage.getItem("userId");

  }
  ngOnInit() {
    this.getTeam();
    this.logged_in_username = sessionStorage.getItem("user_name");
  }

  getTeam(){
    this.teamLength =  this.teamLength+5;
    this.allTeam=[];
    this.data_service.getTeam().subscribe((response: any) =>{
       this.teamArr=response.teams;
       this.openChat(this.teamArr[0],0);
       console.log(this.teamArr[0]);
       if(this.teamArr.length > 5){
          this.moreTeam=true;
          this.teamArr=[];
             for(var i=0;i < this.teamLength;i++){
             this.teamArr.push(response.teams[i]);
          }
       }
     
      console.log(this.teamArr);
    })
  }
  openUser(id){
    this.teamUser=[];
    this.list=[]
    this.openUserModel=true;
    this.list.push(id);
    let postArr = {'teamId': this.list};
    console.log(postArr);
    this.data_service.getTeamUsers(postArr).subscribe((response: any) =>{
    //this.teamUser=response.teams;
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
  closeInfoModal(){
    this.openUserModel=false;

  }
  createTeam(){
    this.showCreate=true;
  }

  getUsers(){
    this.data_service.getUsers().subscribe((response:any) =>{  
      this.users=response.users;
  }, error =>{
      this.isError = true;   
      window.scrollTo(0, 0);
    this.errorsArr = JSON.parse(error._body);
    this.toastr.errorToastr(this.errorsArr, 'Error!');
    console.log(JSON.stringify(this.errorsArr, undefined, 2))
  })
  }

  addUser(id){
    var index = this.usersId.findIndex(x => x == id)

    if (index === -1) {
      this.usersId.push(id);
    }else {
      console.log("object already exists")
      for (var i = 0; i < this.usersId.length; i ++) {
        if (this.usersId[i] === id) { 
            this.usersId.splice(i, 1);
            break;
        }
      }
    }
    this.selectedButton[id]= !this.selectedButton[id];
    console.log(this.usersId);
  }

  continue(){
   var sdfsdf = this.createTeamForm.value;
   if (/\S/.test(sdfsdf.name)) {
      this.hide=false;
      this.IsContinue =true; 
      this.getUsers();
   }
   if (this.createTeamForm.invalid) {
        this.Isrequired=true;
        return;
    }
    this.hide=false;
    this.IsContinue =true;
    this.completed=true;
    this.getUsers();
  }

  back(){
    this.hide=true;
    this.IsContinue=false;
    this.createTeamForm.reset();
    this.completed=false;
  }
  back1(){
      this.showCreate=false;
    }
  TeamSubmit(){
    let data=this.createTeamForm.value;

    this.submitted = true; 
    
    if(this.usersId.length == 0) {
        this.selectUser = true;
        this.validationMessage  = 'Please select atleast one member to team.';
        this.toastr.errorToastr(this.validationMessage, 'Error!');
        return;
    }
    else{ 
      const input_data = { 
       "name" : data.name.trim(), 
       "userId" : this.usersId,
      } 
      console.log(input_data);
      this.data_service.createTeam(input_data).subscribe((response: any) =>{
          this.toastr.successToastr('Team Created Successfully.', 'Success!');
          this.createTeamForm.reset();
          this.showCreate=false;
          this.IsContinue =false;
          this.usersId=[];    
      },
      error =>{console.log(error)}) 
    }     
  }

  openChat(team,index){
   // console.log(team.teamId);
    this.team_id = team.teamId;
    this.user_id = this.logged_in_id;
    this.nickname = team.name;
    this.status = !this.status;
    this.indexCheck = index;  
    this.joinChat();
    this.getMessages();
    this.loadMessages();
    this.loadMyMessages();  
  }
  
  joinChat() { 
    if(this.user_id){
      this.data = {
        "nickname": this.nickname,
        "from_id": this.logged_in_id,
        "username": this.logged_in_username,
        "to_id": this.team_id,      
      }
    } else {
      this.by_default_team = this.firstTeam;
      this.data = { 
        "nickname": this.by_default_team.name,
        "from_id": this.logged_in_id,
        "username": this.logged_in_username,
        "to_id": this.by_default_team.teamId,
      }
    }
        this.socket.emit('set-nickname', this.data);  
      //this.getMessages();
      //this.loadMyMessages();
  }
  sendMessgae() {
    if(this.message == '') {
         this.valMessage = true;
         return;
    } else {
      if(this.user_id ==''){
      this.by_default_team = this.firstTeam;
      this.data = {
        "userId": this.logged_in_id,
        "teamId": this.by_default_team.teamId,
        "username": sessionStorage.getItem("user_name"),
        "msg": this.message
      }
      this.gruopMessages.push({
        "from_id": this.logged_in_id,
        "teamId": this.by_default_team.teamId,
        "username": sessionStorage.getItem("user_name"),
        "message": this.message
      });
    } else {
      this.data = {
        "userId": this.logged_in_id,
        "teamId": this.team_id,
        "username":this.logged_in_username,
        "msg": this.message
      }
      this.gruopMessages.push({
        "from_id": this.logged_in_id,
        "teamId": this.team_id,
        "username":this.logged_in_username,
        "message": this.message
      });
      }
    }

    
    this.socket.emit('newMessage', this.data);
    this.message = '';
    //this.getMessages()
    //this.loadMyMessages();
    //this.loadMessages();
  }
  getMessages() {
    this.socket.on('getMessage', (data) => {
      this.gruopMessages.push(data);  
        //console.log('this.gruopMessages',this.gruopMessages);
      //this.msgData = data;
    });  
    
  } 
  loadMyMessages() {
    
    this.socket.on('messages', (data) => {
      this.gruopMessages = data.messages; 
      
      
    });
  }
  loadMessages() {
    if(this.user_id){
      this.data = {
        "userId": this.user_id,
        "teamId": this.team_id,
      }
    } else {
      this.by_default_team = this.firstTeam;
      this.data = {
        "userId": this.by_default_team.userId,
        "teamId": this.by_default_team.teamId,
      }
    }
    this.nickname = this.nickname;
    this.socket.emit('load-messages', this.data);
        //this.getMessages();
  }
  addmember(){
      console.log("add Member");
  }
  
  viewteamCV(){
        console.log(this.team_id);
           this.list.push(this.team_id);
           this.teamRecord=[];
        let postArr = {'teamId': this.list};
        this.data_service.getTeamUsers(postArr).subscribe((response: any) =>{
          this.teamRecord=response.teams;
          this.list=[];
          console.log(this.teamRecord);

                  if(this.teamRecord.length  != 0){
                var doc = new jsPDF();
            var col = ["Fields", "Inputs"];
              var rows = [];
          var rows1 = [];
          var temp = [];
                  var a = 17;
                    
        /* The following array of object as response from the API req  */
        //  console.log( this.teamRecord[0].userProfile);
           this.teamRecord.forEach(element => {      
              temp = ["UserName",element.userProfile.firstName + " "+element.userProfile.lastName];
                 rows.push(temp);
                 temp = ["Date Of Birth",element.userProfile.dob];
                rows.push(temp); 
                  temp = ["Email",element.userProfile.email];
                rows.push(temp);
                 temp = ["Gender",element.userProfile.gender];
                rows.push(temp);
                  temp = ["Nationality",element.userProfile.phoneNo];
                rows.push(temp);
                  temp = ["PhoneNumber",element.userProfile.phoneNo];
                rows.push(temp);
              temp = ["Contact Address",element.userProfile.address+" "+element.userProfile.country+" "+element.userProfile.postalCode];
                 rows.push(temp);
                 temp = ["Occupation",element.userProfile.occuptation_tt];
                 rows.push(temp);
                 temp = ["WorkPlace",element.userProfile.work_place];
                 rows.push(temp); 
                  temp = ["Languages",element.userProfile.occuptation_tt];
                rows.push(temp);
                 temp = ["PriceRange",element.userProfile.work_place];
                 rows.push(temp);
                  temp = ["Rental Description",element.userProfile.occuptation_tt];
                rows.push(temp);
                 temp = ["StayDate",element.userProfile.work_place];
                 rows.push(temp);
                  temp = ["WakeUp Time",element.userProfile.occuptation_tt];
                rows.push(temp);
                 temp = ["Biography",element.userProfile.biography];
                rows.push(temp);
              temp = ["Interests",element.userProfile.interestes];
                 rows.push(temp);
                  temp = ["Habits",element.userProfile.habits];
                rows.push(temp);
                
             });        

          for(var i = 0;i < a;i++){
                         rows1.push(rows[i]);
               //  console.log(rows1);
                  doc.autoTable(col, rows1,{
                   theme: 'grid',  
                   styles: {rowHeight: 10,overflow: 'linebreak'}, 
                    columnStyles: { 0: {columnWidth: 75},   1: {columnWidth: 110}},
                            margin: { top: 20, left: 20, right: 20, bottom: 0 },
               });
                  if(i+1 == a)
                  {
                        doc.addPage();
                        rows1=[];
              //  console.log("-----------");
                      if(a < rows.length){
                         a=a+17;
                      }
                      
                  }

          }
            doc.save(this.nickname+'.pdf');
              }
        })
  }
}