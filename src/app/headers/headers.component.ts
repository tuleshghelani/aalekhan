import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-headers',
  templateUrl: './headers.component.html',
  styleUrls: ['./headers.component.scss']
})
export class HeadersComponent implements OnInit {
@Input() screenWidth:any;
@Input() activePage!:string
@Output() actionEvent = new EventEmitter<any>();
  constructor(private router:Router) { }

  ngOnInit(): void {
  }

  contactDialog(){}

  openAboutUs(){
    this.actionEvent.emit(true)
  }
  navigateToHome() {
    this.router.navigate(['/']); // Replace 'home' with your actual home route path
  }
  
}
