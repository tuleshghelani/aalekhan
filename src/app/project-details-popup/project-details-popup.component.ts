import { Component, Inject } from '@angular/core';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { Project } from '../services/project.service';

@Component({
  selector: 'app-project-details-popup',
  templateUrl: './project-details-popup.component.html',
  styleUrls: ['./project-details-popup.component.scss']
})
export class ProjectDetailsPopupComponent {
  selectedImageIndex: number = 0;

  constructor(@Inject(MAT_DIALOG_DATA) public project: Project) {}

  selectImage(index: number): void {
    this.selectedImageIndex = index;
  }
}