import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { ServiceComponent } from './service/service.component';
import { AppComponent } from './app.component';
import { TeamComponent } from './team/team.component';
import { AboutDialogComponent } from './about-dialog/about-dialog.component';
import { ContactComponent } from './contact/contact.component';
import { ProjectComponent } from './project/project.component';
import { ProjectDetailsComponent } from './project/project-details/project-details.component';
import { AllProjectsComponent } from './all-projects/all-projects.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about-us', component: AboutUsComponent },
  { path: 'contact-us', component: ContactComponent },
  { path: 'service', component: ServiceComponent },
  // { path: 'team', component: TeamComponent },
  { path: 'about-dialog', component: AboutDialogComponent },
  { path: 'projects', component: AllProjectsComponent },
  { path: 'projects/details', component: ProjectDetailsComponent },
  { path: '**', component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
