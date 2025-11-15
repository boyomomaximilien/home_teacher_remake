import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Myfooter } from './myfooter';

describe('Myfooter', () => {
  let component: Myfooter;
  let fixture: ComponentFixture<Myfooter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Myfooter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Myfooter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
