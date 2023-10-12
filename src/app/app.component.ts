import { NgModule, AfterViewInit, Component, OnInit, HostListener } from '@angular/core';
// import * as fullpage from 'fullpage.js';
declare const fullpage: any; // Provide type annotation for fullpage
import * as AOS from "aos";
import { trigger, state, style, transition, animate } from '@angular/animations';
import { FormControl, FormGroup } from '@angular/forms';

// import { Swiper } from "swiper";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
constructor(){}
}
