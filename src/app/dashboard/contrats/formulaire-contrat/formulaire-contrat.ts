import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Contract } from '../../../Models/contract';

@Component({
  selector: 'app-formulaire-contrat',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './formulaire-contrat.html',
  styleUrls: ['./formulaire-contrat.css']
})
export class FormulaireContratComponent implements OnChanges {
  @Input() contract: Contract | null = null;
  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  contractForm: FormGroup;
  subjects = ['Mathématiques', 'Physique', 'Chimie', 'Français', 'Anglais', 'Histoire', 'Géographie', 'Suivi general'];
  daysOfWeek = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

  private fb = inject(FormBuilder);

  constructor() {
    this.contractForm = this.fb.group({
      studentName: ['', Validators.required],
      studentClasse: ['', Validators.required],
      sessionTime: ['', [Validators.required, Validators.min(1)]],
      prix: ['', [Validators.required, Validators.min(1000)]],
      matieres: this.fb.array([], Validators.required),
      courseDays: this.fb.array([], Validators.required)
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['contract'] && this.contract) {
      this.contractForm.patchValue({
        studentName: this.contract.studentName,
        studentClasse: this.contract.studentClasse,
        sessionTime: this.contract.sessionTime,
        prix: this.contract.Prix,
      });

      this.setFormArray('matieres', this.contract.matieres);
      this.setFormArray('courseDays', this.contract.courseDay);
    } else {
      this.contractForm.reset();
      (this.contractForm.get('matieres') as FormArray).clear();
      (this.contractForm.get('courseDays') as FormArray).clear();
    }
  }

  private setFormArray(arrayName: string, values: string[]): void {
    const formArray = this.contractForm.get(arrayName) as FormArray;
    formArray.clear();
    values.forEach(value => formArray.push(this.fb.control(value)));
  }

  onMatiereChange(event: any): void {
    const matieres: FormArray = this.contractForm.get('matieres') as FormArray;
    if (event.target.checked) {
      matieres.push(this.fb.control(event.target.value));
    } else {
      const index = matieres.controls.findIndex(x => x.value === event.target.value);
      matieres.removeAt(index);
    }
  }

  onDayChange(event: any): void {
    const courseDays: FormArray = this.contractForm.get('courseDays') as FormArray;
    if (event.target.checked) {
      courseDays.push(this.fb.control(event.target.value));
    } else {
      const index = courseDays.controls.findIndex(x => x.value === event.target.value);
      courseDays.removeAt(index);
    }
  }

  onSubmit(): void {
    if (this.contractForm.valid) {
      this.save.emit(this.contractForm.value);
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }

  // Helper getters for template to check if a checkbox should be checked
  isMatiereChecked(matiere: string): boolean {
    return (this.contractForm.get('matieres') as FormArray).value.includes(matiere);
  }

  isDayChecked(day: string): boolean {
    return (this.contractForm.get('courseDays') as FormArray).value.includes(day);
  }
}