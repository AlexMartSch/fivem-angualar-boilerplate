import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreOrderDialogComponent } from './pre-order-dialog.component';

describe('PreOrderDialogComponent', () => {
  let component: PreOrderDialogComponent;
  let fixture: ComponentFixture<PreOrderDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PreOrderDialogComponent]
    });
    fixture = TestBed.createComponent(PreOrderDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
