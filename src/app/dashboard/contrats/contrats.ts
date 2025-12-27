import { Component, inject, Input } from '@angular/core';
import { Contract } from '../../Models/contract';
import { CommonModule } from '@angular/common';
import { App } from '../../app';
import { ReactiveFormsModule } from '@angular/forms';
import { HandlerContract } from '../../Handlers/handler-contract';
import { FormulaireContratComponent } from './formulaire-contrat/formulaire-contrat';

@Component({
  selector: 'app-contrats',
  imports: [CommonModule, ReactiveFormsModule, FormulaireContratComponent],
  templateUrl: './contrats.html',
  styleUrl: './contrats.css'
})
export class Contrats {
  private handlerContract = inject(HandlerContract);
  @Input() tousMesContrats!: Contract[];

  public Nature = App.connectedUserDataBase?.Nature;

  showAddContractForm = false;

  showDeleteModal = false;
  contractToDelete: Contract | null = null;

  isEditModalOpen = false;
  selectedContract: Contract | null = null;

  constructor() {
  }

  async ngOnInit() {
    this.tousMesContrats = await this.handlerContract.obtenirContrats();
  }

  toggleAddContractForm() {
    this.showAddContractForm = !this.showAddContractForm;
  }

  async enregistrerContrat(formValue: any) {
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

    await this.handlerContract.sauvegarderContrat(contrat);
    this.tousMesContrats.push(contrat);
    this.showAddContractForm = false;
  }

  async updateContract(formValue: any) {
    if (!this.selectedContract) return;

    const updatedContract = new Contract(
      formValue.studentName,
      'personne_icone.png',
      formValue.courseDays,
      formValue.sessionTime,
      formValue.studentClasse,
      formValue.prix,
      this.selectedContract.datePaiement,
      formValue.matieres
    );
    updatedContract.Id = this.selectedContract.Id;
    updatedContract.IdCreator = this.selectedContract.IdCreator;

    await this.handlerContract;

    const index = this.tousMesContrats.findIndex(c => c.Id === this.selectedContract!.Id);
    if (index > -1) {
      this.tousMesContrats[index] = updatedContract;
    }

    this.closeEditModal();
  }


  openEditModal(contract: Contract) {
    this.selectedContract = contract;
    this.isEditModalOpen = true;
  }

  closeEditModal() {
    this.isEditModalOpen = false;
    this.selectedContract = null;
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
}