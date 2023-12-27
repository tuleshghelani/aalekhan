import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FileServiceService } from '../file-service.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  formData: FormGroup;

  constructor(private fb: FormBuilder, private fileService: FileServiceService) {
    this.formData = this.fb.group({
      firstName: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      description: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
      // Add more form fields as needed
    });
  }

  ngOnInit(): void {
  }
  onSubmit(): void {
    if (this.formData.valid) {
      const formValues = this.formData.getRawValue();
      // Call the service to export the form data to CSV
      this.fileService.exportFormData([formValues]);
    }
  }
}
