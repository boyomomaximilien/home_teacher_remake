import { Component } from '@angular/core';
import { Contract } from '../../Models/contract';
import { CommonModule } from '@angular/common';
import { App } from '../../app';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-contrats',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contrats.html',
  styleUrl: './contrats.css'
})
export class Contrats {
  Contracts: Contract[] = [];
  contrat = new Contract('kdfd7dm', 'Bekono Ange', 'Bekono Jean', ['dimanche', 'lundi', 'samedi'], 2, '4 eme', 65000, new Date('2025-12-20'));

  isMobile = false;
  activeIndex: number | null = null;
  public Nature = App.connectedUserDataBase?.Nature;

  contractForm: FormGroup;
  subjects = ['Mathématiques', 'Physique', 'Chimie', 'Français', 'Anglais', 'Histoire', 'Géographie', 'Suivi general'];
  daysOfWeek = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

  showAddContractForm = false;
  createdContract: any | null = null;

  constructor(private fb: FormBuilder) {
    this.Contracts.push(this.contrat);
    this.Contracts.push(this.contrat);
    this.Contracts.push(this.contrat);
    this.Contracts.push(this.contrat);
    this.checkMobile();

    this.contractForm = this.fb.group({
      matiere: ['', Validators.required],
      studentName: ['', Validators.required],
      studentClasse: ['', Validators.required],
      courseDays: this.fb.array([], Validators.required),
      sessionTime: ['', [Validators.required, Validators.min(1)]],
      prix: ['', [Validators.required, Validators.min(1000)]]
    });
  }

  toggleAddContractForm() {
    this.showAddContractForm = !this.showAddContractForm;
  }

  onDayChange(event: any) {
    const courseDays: FormArray = this.contractForm.get('courseDays') as FormArray;

    if (event.target.checked) {
      courseDays.push(this.fb.control(event.target.value));
    } else {
      const index = courseDays.controls.findIndex(x => x.value === event.target.value);
      courseDays.removeAt(index);
    }
  }

  onSubmit() {
    if (this.contractForm.valid) {
      this.createdContract = this.contractForm.value;
      this.showAddContractForm = false;
      this.contractForm.reset();
      // Reset the FormArray
      (this.contractForm.get('courseDays') as FormArray).clear();
    } else {
      console.log('Le formulaire contient des erreurs.');
    }
  }

  createNewContract() {
    this.createdContract = null;
    this.showAddContractForm = true;
  }

  dismissSummary() {
    this.createdContract = null;
  }


  checkMobile() {
    this.isMobile = window.innerWidth < 600;
    window.addEventListener('resize', () => {
      this.isMobile = window.innerWidth < 600;
    });
  }

  toggleDetails(index: number) {
    this.activeIndex = this.activeIndex === index ? null : index;
  }

  ngOnInit() { }
}
