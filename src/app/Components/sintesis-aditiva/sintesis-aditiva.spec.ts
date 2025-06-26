import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SintesisAditiva } from './sintesis-aditiva';

describe('SintesisAditiva', () => {
  let component: SintesisAditiva;
  let fixture: ComponentFixture<SintesisAditiva>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SintesisAditiva]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SintesisAditiva);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
