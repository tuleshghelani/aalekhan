import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileServiceService {

  constructor() { }

  exportFormData(formData: any): void {
    const data = this.convertToCSV(formData);
    const blob = new Blob([data], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'userdata.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  private convertToCSV(data: any[]): string {
    const headers = Object.keys(data[0]).join(',') + '\n';
    const values = data.map(item => Object.values(item).join(',')).join('\n');
    return headers + values;
  }
}
