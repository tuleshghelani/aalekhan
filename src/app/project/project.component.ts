import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeadersComponent } from '../headers/headers.component';

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [CommonModule, RouterModule, HeadersComponent],
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent {

  constructor() { }

  ngOnInit(): void {
  }

}
