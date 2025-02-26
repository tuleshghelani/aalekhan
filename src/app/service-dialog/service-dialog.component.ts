import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-service-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './service-dialog.component.html',
  styleUrls: ['./service-dialog.component.scss']
})
export class ServiceDialogComponent {
  public content: string= '';
  public serviceName: any;
  constructor(
    public dialogRef: MatDialogRef<ServiceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.serviceName = data;
    console.log('receive =>>', data);
    console.log('this.data==="Print Media" : ', this.serviceName);
    
    if (data === "Print Media") {
      this.content = 'The project entails the creation of a tri-fold brochure aimed at promoting our new product line of eco-friendly household items. The brochure will serve as a promotional tool distributed during trade shows and events.';
      this.content += 'Develop a design consistent with our brand colors (green, blue, and white) and convey a modern, environmentally conscious theme.';
    }
  }
}
