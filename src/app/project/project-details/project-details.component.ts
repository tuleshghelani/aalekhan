import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeadersComponent } from '../../headers/headers.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [CommonModule, HeadersComponent, RouterModule],
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss']
})
export class ProjectDetailsComponent {
  handleHeaderAction(action: string) {
    // Handle header actions
  }
}
