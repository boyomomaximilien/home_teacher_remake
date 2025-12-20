import { Component, inject, Input } from '@angular/core';
import { Contract } from '../../Models/contract';
import { CommonModule } from '@angular/common';
import { App } from '../../app';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { HandlerContract } from '../../Handlers/handler-contract';


@Component({
  selector: 'app-contrats',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contrats.html',
  styleUrl: './contrats.css'
})
export class Contrats {
  private handlerContract = inject(HandlerContract);
  @Input() tousMesContrats!: Contract[];

  isMobile = false;
  activeIndex: number | null = null;
  public Nature = App.connectedUserDataBase?.Nature;

  contractForm: FormGroup;
  subjects = ['Mathématiques', 'Physique', 'Chimie', 'Français', 'Anglais', 'Histoire', 'Géographie', 'Suivi general'];
  daysOfWeek = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

  showAddContractForm = false;
  createdContract: any | null = null;

  showDeleteModal = false;
  contractToDelete: Contract | null = null;

  constructor(private fb: FormBuilder) {

    this.checkMobile();

    this.contractForm = this.fb.group({
      matieres: this.fb.array([], Validators.required),
      studentName: ['', Validators.required],
      studentClasse: ['', Validators.required],
      courseDays: this.fb.array([], Validators.required),
      sessionTime: ['', [Validators.required, Validators.min(1)]],
      prix: ['', [Validators.required, Validators.min(1000)]],
    });
  }

  async ngOnInit() {
    this.tousMesContrats = await this.handlerContract.obtenirContrats();
    this.recupererContrat()

  }


  async recupererContrat() {
    // 
    this.tousMesContrats = await this.handlerContract.obtenirContrats()
  }

  toggleAddContractForm() {
    this.showAddContractForm = !this.showAddContractForm;
  }

  onMatiereChange(event: any) {
    const matieres: FormArray = this.contractForm.get('matieres') as FormArray;

    if (event.target.checked) {
      matieres.push(this.fb.control(event.target.value));
    } else {
      const index = matieres.controls.findIndex(x => x.value === event.target.value);
      matieres.removeAt(index);
    }
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

  async enregistrerContrat() {

    if (this.contractForm.valid) {
      const formValue = this.contractForm.value;
      const contrat = new Contract(
        formValue.studentName,
        'personne_icone.png', // Image par défaut
        formValue.courseDays,
        formValue.sessionTime,
        formValue.studentClasse,
        formValue.prix,
        new Date(), // Date actuelle pour le paiement
        formValue.matieres
      );

      contrat.IdCreator = App.connectedUserUid;

      await this.handlerContract.sauvegarderContrat(contrat)
      this.tousMesContrats.push(contrat)
      this.showAddContractForm = false;
      this.contractForm.reset();
      // Reset the FormArray
      (this.contractForm.get('matieres') as FormArray).clear();
      (this.contractForm.get('courseDays') as FormArray).clear();
    } else {
    }
  }

  createNewContract() {
    this.createdContract = null;
    this.showAddContractForm = true;
  }

  dismissSummary() {
    this.createdContract = null;
  }

  openDeleteModal(contract: Contract) {
    this.contractToDelete = contract;
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.contractToDelete = null;
  }

  async confirmDelete() {
    if (this.contractToDelete) {
      await this.handlerContract.supprimerContrat(this.contractToDelete.Id);
      this.tousMesContrats = this.tousMesContrats.filter(c => c.Id !== this.contractToDelete!.Id);
      this.closeDeleteModal();
    }
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


}
