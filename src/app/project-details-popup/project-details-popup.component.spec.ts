import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectDetailsPopupComponent } from './project-details-popup.component';

describe('ProjectDetailsPopupComponent', () => {
  let component: ProjectDetailsPopupComponent;
  let fixture: ComponentFixture<ProjectDetailsPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectDetailsPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectDetailsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
