import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeadersComponent } from '../headers/headers.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { ServiceDialogComponent } from '../service-dialog/service-dialog.component';

@Component({
  selector: 'app-service',
  standalone: true,
  imports: [CommonModule, HeadersComponent, MatDialogModule],
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.scss']
})
export class ServiceComponent {

  constructor(private dialog:MatDialog) { }

  ngOnInit(): void {
  }

  openServiceDialog(service:string,icon:string){
    console.log('service =>>',service)
    let dialogData = {
      service:service,
      icon:icon
    }
    this.dialog.open(ServiceDialogComponent,{
      // width:"90%",
      // height:'90%',
      data:dialogData
    })
  }
}
