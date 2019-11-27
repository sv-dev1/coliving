import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-download',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.css']
})
export class DownloadComponent implements OnInit {
  openFileDownloadModal : boolean = false;
  message : string = '';
  constructor() { }

  ngOnInit() {
  	this.downloadFile();
  }
  
  downloadFile() {
  	this.openFileDownloadModal = true;
  }
  closeModal() {
		setTimeout(() => {
            this.message = 'Colive app downloaded successfully!.';
		}, 2000);
  }
}
