import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeadersComponent } from '../headers/headers.component';
import { RouterModule } from '@angular/router';
import VanillaTilt from 'vanilla-tilt';
import { ProjectService, Project } from '../services/project.service';
import { ProjectDetailsPopupComponent } from '../project-details-popup/project-details-popup.component';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';

@Component({
  selector: 'app-all-projects',
  standalone: true,
  imports: [CommonModule, HeadersComponent, RouterModule],
  templateUrl: './all-projects.component.html',
  styleUrls: ['./all-projects.component.scss']
})
export class AllProjectsComponent implements OnInit, AfterViewInit {
  projects: Project[] = [];

  constructor(private projectService: ProjectService,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.projects = this.projectService.getProjects();
  }

  ngAfterViewInit(): void {
    this.initTilt();
  }

  initTilt(): void {
    VanillaTilt.init(Array.from(document.querySelectorAll("[data-tilt]")) as HTMLElement[], {
      max: 15,
      speed: 400,
      glare: true,
      "max-glare": 0.2,
    });
  }

  onMouseMove(event: MouseEvent): void {
    const card = event.currentTarget as HTMLElement;
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  }

  onMouseLeave(event: MouseEvent): void {
    const card = event.currentTarget as HTMLElement;
    card.style.removeProperty('--mouse-x');
    card.style.removeProperty('--mouse-y');
  }

  openProjectDetails(project: Project): void {
    this.dialog.open(ProjectDetailsPopupComponent, {
      data: project,
      maxWidth: '90vw',
      maxHeight: '90vh'
    });
  }
}
