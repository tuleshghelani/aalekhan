import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MnFullpageModule } from 'ngx-fullpage';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { ServiceComponent } from './service/service.component';
import { AutoTypeDirective } from './auto-type.directive';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutUsComponent,
    ServiceComponent,
    AutoTypeDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MnFullpageModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
