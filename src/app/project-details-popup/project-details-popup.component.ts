import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { Project } from '../services/project.service';

@Component({
  selector: 'app-project-details-popup',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
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