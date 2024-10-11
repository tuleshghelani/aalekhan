import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
// import { MnFullpageModule } from 'ngx-fullpage';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { ServiceComponent } from './service/service.component';
import { AutoTypeDirective } from './auto-type.directive';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatLegacyRadioModule as MatRadioModule } from '@angular/material/legacy-radio';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacySliderModule as MatSliderModule } from '@angular/material/legacy-slider';
import { FormsModule } from '@angular/forms';
import { HeadersComponent } from './headers/headers.component';
// import { MatRadioGroupModule } from '@angular/material/radio';

import {MatLegacyCheckboxModule as MatCheckboxModule} from '@angular/material/legacy-checkbox';
import {MatLegacyCardModule as MatCardModule} from '@angular/material/legacy-card';
import { TeamComponent } from './team/team.component';
import { AboutDialogComponent } from './about-dialog/about-dialog.component';
import { ContactComponent } from './contact/contact.component';
import { ServiceDialogComponent } from './service-dialog/service-dialog.component';
import { ProjectComponent } from './project/project.component';
import { ProjectDetailsComponent } from './project/project-details/project-details.component';
import { AllProjectsComponent } from './all-projects/all-projects.component';
import { ProjectDetailsPopupComponent } from './project-details-popup/project-details-popup.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutUsComponent,
    ServiceComponent,
    AutoTypeDirective,
    HeadersComponent,
    TeamComponent,
    AboutDialogComponent,
    ContactComponent,
    ServiceDialogComponent,
    ProjectComponent,
    ProjectDetailsComponent,
    AllProjectsComponent,
    ProjectDetailsPopupComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    // MnFullpageModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatRadioModule,
    MatSelectModule,
    MatSliderModule,
    FormsModule,
    
    MatFormFieldModule,
    MatSliderModule,
    MatCardModule,
    MatDialogModule
    // MatRadioGroupModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
