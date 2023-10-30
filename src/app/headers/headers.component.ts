import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-headers',
  templateUrl: './headers.component.html',
  styleUrls: ['./headers.component.scss']
})
export class HeadersComponent implements OnInit {
@Input() screenWidth:any;
@Input() activePage!:string
@Output() actionEvent = new EventEmitter<any>();
  constructor() { }

  ngOnInit(): void {
  }

  contactDialog(){}

  openAboutUs(){
    this.actionEvent.emit(true)
  }

}
