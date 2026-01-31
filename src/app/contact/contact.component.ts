import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { HeadersComponent } from '../headers/headers.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FileServiceService } from '../file-service.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HeadersComponent,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent {
  formData: FormGroup;

  constructor(private fileService: FileServiceService) {
    this.formData = new FormGroup({
      name: new FormControl(''),
      email: new FormControl(''),
      message: new FormControl('')
    });
  }

  onSubmit(): void {
    if (this.formData.valid) {
      const formValues = this.formData.getRawValue();
      // Call the service to export the form data to CSV
      this.fileService.exportFormData([formValues]);
    }
  }
}
