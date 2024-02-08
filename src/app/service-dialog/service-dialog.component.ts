import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-service-dialog',
  templateUrl: './service-dialog.component.html',
  styleUrls: ['./service-dialog.component.scss']
})
export class ServiceDialogComponent implements OnInit {

  public content: string= '';
  public serviceName: any;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    this.serviceName=this.data;
    console.log('receive =>>',this.data)
    console.log('this.data==="Print Media" : ', this.serviceName);
    
    if(this.data==="Print Media") {
      this.content='The project entails the creation of a tri-fold brochure aimed at promoting our new product line of eco-friendly household items. The brochure will serve as a promotional tool distributed during trade shows and events.';
      this.content+='Develop a design consistent with our brand colors (green, blue, and white) and convey a modern, environmentally conscious theme.';
    }
  }

}
