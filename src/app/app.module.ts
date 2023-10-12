import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MnFullpageModule } from 'ngx-fullpage';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { ServiceComponent } from './service/service.component';
import { AutoTypeDirective } from './auto-type.directive';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { FormsModule } from '@angular/forms';
import { HeadersComponent } from './headers/headers.component';
// import { MatRadioGroupModule } from '@angular/material/radio';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutUsComponent,
    ServiceComponent,
    AutoTypeDirective,
    HeadersComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MnFullpageModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatRadioModule,
    MatSelectModule,
    MatSliderModule,
    FormsModule
    // MatRadioGroupModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
