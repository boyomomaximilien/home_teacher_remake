import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormulaireContrat } from './formulaire-contrat';

describe('FormulaireContrat', () => {
  let component: FormulaireContrat;
  let fixture: ComponentFixture<FormulaireContrat>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormulaireContrat]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormulaireContrat);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
