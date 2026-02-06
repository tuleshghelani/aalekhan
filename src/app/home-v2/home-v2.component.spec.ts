import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeV2Component } from './home-v2.component';
import { RouterModule } from '@angular/router';
import { HeadersComponent } from '../headers/headers.component';
import { Meta, Title } from '@angular/platform-browser';
import { TransferState } from '@angular/core';

describe('HomeV2Component', () => {
  let component: HomeV2Component;
  let fixture: ComponentFixture<HomeV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HomeV2Component,
        RouterModule.forRoot([]),
      ],
      providers: [Meta, Title, TransferState],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
