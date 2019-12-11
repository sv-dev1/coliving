import {
  Component,
  OnInit,
  Input
} from '@angular/core';
import {
  Router
} from '@angular/router';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray
} from '@angular/forms';
import {
  DataService
} from '../../data.service';
import {
  ToastrManager
} from 'ng6-toastr-notifications';
import {
  first
} from 'rxjs/operators';
import {
  DatePipe
} from '@angular/common';
import {
  HttpClient,
  HttpHeaders,
  HttpClientModule
} from '@angular/common/http';
import {
  environment
} from '../../../environments/environment';


@Component({
  selector: 'app-create-bill',
  templateUrl: './create-bill.component.html',
  styleUrls: ['./create-bill.component.css']
})
export class CreateBillComponent implements OnInit {
  createBillForm: FormGroup;
  submitted: boolean = false;
  isError: boolean = false;
  isSuccess: boolean = false;
  errorsArr: any = [];
  teamData: any;
  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};
  userdropdownList = [];
  userselectedItems = [];
  userdropdownSettings = {};
  teamuser: any;
  fileData: any;
  base_url: string = "";
  teamName: any = [];
  assignUser: any = [];
  teamEmpty: boolean = false;
  userEmpty: boolean = false;
  selectEmpty: boolean = false;
  list: any = [];
  url: any = '';
  payerselectedItems: any = [];
  whoPayEmpty: boolean = false;
  assignWhoPayed: any = [];
  noData: boolean = true;
  addPayee: boolean = true;
  repeatRows: any = [1];
  payeeNameArr = [];
  payeePriceArr = [];
  PayeeList: any = [];
  selectedInfo: any = [];
  amount: any;
  isVisible: boolean = false;
  lessAmount: any;
  totalAmount: any;
  amountPerUser: any;
  amountSplit: any = [];
  amountSplit1: any = [];

  itemsCount: any;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private data_service: DataService,
    public toastr: ToastrManager,
    private datePipe: DatePipe,
    private http: HttpClient,
  ) {
    this.createBillForm = this.formBuilder.group({
        team: ['', Validators.required],
        title: ['', Validators.required],
        amount: ['', Validators.required],
        date: ['', Validators.required],
        bill: ['', Validators.required],
        assign_to: ['', Validators.required],
        items: this.formBuilder.array([this.createItem()]),
        payees: this.formBuilder.array([this.formBuilder.group({})]),

    });
    this.base_url = environment.base_url;

  }
  @Input() editable: boolean = false; // doesn't have to be an @Input


  ngOnInit() {
    this.getTeam();

  }

  createItem() {
    return this.formBuilder.group({
      user: [''],
      price: ['']
    })
  }
  get f() {
    return this.createBillForm.controls;
  }
  onSelectFile(event) {
    this.fileData = event.target.files[0];
    this.preview();
  }
  preview() {
    var mimeType = this.fileData.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    var reader = new FileReader();
    reader.readAsDataURL(this.fileData);
    reader.onload = (_event) => {
      this.url = reader.result;
    }
  }
  createBill() {
   
    this.amountSplit1 = [];
    this.createBillForm.value['items'].forEach(obj => {
      this.amountSplit1.push(obj.price);
    });
    let totalAmount = eval(this.amountSplit1.join('+'));
   
    if (this.createBillForm.value['team'] == "") {
       this.teamEmpty = true;
    }
    if (this.createBillForm.value['assign_to'] == "") {
        this.userEmpty = true;
    }
    if (this.createBillForm.value['items'] == "") {
        this.whoPayEmpty = true;
    }
    this.submitted = true;
    
    if (this.createBillForm.invalid) {
      return;
    } else {
        if (totalAmount > this.createBillForm.value['amount']) {
            this.toastr.warningToastr('Amount splited between payeers exceeded the total amount.');
            return
        }
        let data = this.createBillForm.value;
        data.items.forEach(obj => {
          this.payeeNameArr.push(obj.user);
          this.payeePriceArr.push(obj.price);
        });
        data.team.forEach(element => {
          this.teamName.push(element.id);
        });
        data.assign_to.forEach(element => {
          this.assignUser.push(element.id);
        });
      const input_data = {
        "team": data.team,
        "title": data.title,
        "amount": data.amount,
        "date": this.datePipe.transform(data.date, 'yyyy-MM-dd'),
        "bill": this.fileData,
        "assign_to": data.assign_to,
      }
      console.log('adasdasdsaddsadsa',input_data);
      const formData = new FormData();
      formData.append('title', input_data.title);
      formData.append('files', this.fileData);
      formData.append('team', this.teamName);
      formData.append('amount', input_data.amount);
      formData.append('date', input_data.date);
      formData.append('userId', this.assignUser);
      formData.append('payee_name', (this.payeeNameArr).toString());
      formData.append('payee_price', (this.payeePriceArr).toString());
      let token;
      if (sessionStorage.getItem("auth_token") != undefined) {
        token = sessionStorage.getItem("auth_token");
      }
      const httpOptions = {
        headers: new HttpHeaders({
          'authorization': token
        })
      };
      this.http.post(this.base_url + 'createBills', formData, httpOptions).subscribe((response: any) => {
        this.toastr.successToastr(response.message, 'Success!');
        this.submitted = false;
        this.createBillForm.reset();
        this.url = '';
        this.router.navigate(['/split-bill']); 
        this.isError = false;  
      }, error => {
        //console.log("ERROR");
        //console.log(error.error);
        console.log('error', error);
      });
    }
  }

  getTeam() {
    this.data_service.getTeam().subscribe((response: any) => {
      this.teamData = response['teams'];
      // console.log(this.teamData);
      this.teamData.forEach(ele => {
        let obj = {};
        obj['id'] = ele['teamId'];
        obj['itemName'] = ele['name'];
        this.dropdownList.push(obj);
      });

      this.dropdownSettings = {
        singleSelection: false,
        text: "Select Team",
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        classes: "myclass custom-class",
        limitSelection: 2,
        enableSearchFilter: true,
      };
    }, error => {
      this.isError = true;
      window.scrollTo(0, 0);
      this.errorsArr = JSON.parse(error._body);
      this.toastr.errorToastr(this.errorsArr, 'Error!');

    })
  }

  onTeamSelection() {
    let tmp = [];
    let postArr = {
      'teamId': this.list
    };
    // console.log(postArr);
    this.data_service.getTeamUsers(postArr).subscribe((response: any) => {
      this.teamuser = response.teams;
      for (let i = 0; i < this.teamuser.length; i++) {
        if (this.teamuser[i].userProfile) {
          tmp.push({
            id: this.teamuser[i].userProfile['userId'],
            itemName: this.teamuser[i].login.username
          });
        }
      }
      this.userdropdownList = tmp;
      this.userdropdownSettings = {
        singleSelection: false,
        text: "Select User",
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        classes: "myclass custom-class"
      };
    }, error => {
      this.isError = true;
      window.scrollTo(0, 0);
      this.errorsArr = JSON.parse(error._body);
      this.toastr.errorToastr(this.errorsArr, 'Error!');
      // console.log(JSON.stringify(this.errorsArr, undefined, 2))
    })

  }
  onItemSelect(item: any) {
    this.list.push(item['id']);
    this.onTeamSelection();
    this.teamEmpty = false;
  }
  OnItemDeSelect(item: any) {

    this.list.splice(this.list.indexOf(this.list), 1);
    this.onTeamSelection();

  }
  onSelectAll(items: any) {
    items.forEach(element => {
      this.list.push(element['id']);
    });
    this.onTeamSelection();
    this.teamEmpty = false;
  }
  onDeSelectAll(items: any) {
    //console.log(items);
    this.list = [];
    this.onTeamSelection();
  }
  onUserSelectAll(items: any) {

    this.noData = false;
    this.userEmpty = false;
    items.forEach(element => {
      this.userselectedItems.push(element);
    });
  }
  onUserItemSelect(item: any) {
    this.userselectedItems.push(item);
    this.noData = false;
    this.userEmpty = false;
  }
  OnUserItemDeSelect(item: any) {

    this.userselectedItems.splice(this.userselectedItems.indexOf(item), 1);
    if(this.userselectedItems.length == 0) {
        this.userEmpty = true;
    }
  }
  onUserDeSelectAll(items: any) {
       this.userselectedItems = [];
       this.userEmpty = true;
  }

  onPayedSelectAll(items: any) {
    this.payerselectedItems.push(items);
  }
  onPayedItemSelect(item: any) {
    this.payerselectedItems.push(item);
  }
  OnPayedItemDeSelect(item: any) {
    //console.log(this.userselectedItems);
  }
  onPayedDeSelectAll(items: any) {
    // console.log(items);
  }

  numberOnly(event): boolean {

    if (event.srcElement.value != '') {
      this.amount = event.srcElement.value;
      this.isVisible = true;
    }
    if (event.srcElement.value == '' || event.srcElement.value == null) {
      this.isVisible = false;
    }
    return true;
  }
  addmore(i) {
    if (this.userselectedItems.length <= this.repeatRows.length) {
          this.toastr.infoToastr('Selected users exceeded.', 'Information!');
    } else {
      this.repeatRows.push(i + 1);
      (this.createBillForm.controls['items'] as FormArray).push(this.createItem());
    }
    //  console.log(this.createBillForm.controls['items']);

  }
  delete() {
    this.repeatRows.splice(0, 1);
  }
  selected(info) {
    this.editable = true;
    this.selectedInfo.push(info);
  }

  checkAmountIsValid(event: any) {
    this.amountSplit1.splice(this.amountSplit1.indexOf(event.srcElement.value), 1);
    var amount = event.srcElement.value;
    this.amountSplit.push(amount);
    let totalAmount = eval(this.amountSplit.join('+'));
    if (totalAmount > this.amount) {
      console.log('length', this.amountSplit.length);
      //this.toastr.warningToastr('Amount splited between payeers exceeded the total amount.');
    }
  }
}