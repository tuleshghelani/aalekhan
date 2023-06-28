import { AfterViewInit, Component, OnInit } from '@angular/core';
// import * as fullpage from 'fullpage.js';
declare const fullpage: any; // Provide type annotation for fullpage
import * as AOS from "aos";
// import Swiper from "swiper";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'aalekhan';
  ngOnInit(){
    // var video = document.getElementById('bgVideo');
    //   console.log(video)
    AOS.init();
    // var swiper = new Swiper('.blog-slider', {
    //   spaceBetween: 30,
    //   effect: 'fade',
    //   loop: true,
    //   mousewheel: {
    //     invert: false,
    //   },
    //   // autoHeight: true,
    //   pagination: {
    //     el: '.blog-slider__pagination',
    //     clickable: true,
    //   }
    // });
  }
  
}
