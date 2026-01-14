import { Component, inject, Input, ChangeDetectorRef } from '@angular/core';
import { Contract } from '../../Models/contract';
import { CommonModule } from '@angular/common';
import { App } from '../../app';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HandlerContract } from '../../Handlers/handler-contract';
import { FormulaireContratComponent } from './formulaire-contrat/formulaire-contrat';
import { HandlerTeacher } from '../../Handlers/handler-teacher';
import { Teacher } from '../../Models/teacher';
import { Subscription, timer} from 'rxjs';

@Component({
  selector: 'app-contrats',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, FormulaireContratComponent],
  templateUrl: './contrats.html',
  styleUrl: './contrats.css'
})
export class Contrats {

  private handlerContract;
  private handlerEnseignant;
  private cdr = inject(ChangeDetectorRef);
  private contratSubscription: Subscription;
  @Input() tousMesContrats!: Contract[];

  public Nature = App.connectedUserDataBase?.Nature;

  showAddContractForm = false;

  showDeleteModal = false;
  contractToDelete: Contract | null = null;

  // Assign modal state
  showAssignModal = false;
  contractToAssign: Contract | null = null;
  assignTeacherId: string = '';
  assignError: string = '';

  isEditModalOpen = false;
  selectedContract: Contract | null = null;

  constructor() {
    this.handlerContract = inject(HandlerContract);
    this.handlerEnseignant = inject(HandlerTeacher);
    this.contratSubscription = timer(0, 10000).subscribe(() => {this.recupererContrat(); console.log('Contrats mis à jour'); });
  }

  async ngOnInit() {
  }

  async recupererContrat() {
    // 
    if (App.connectedUserDataBase?.Nature=== 'client') {
      this.tousMesContrats = await this.handlerContract.obtenirContrats()
    }
    else if (App.connectedUserDataBase?.Nature === 'teacher') {
      if(App.connectedUserDataBase?.ListContratsUid !== undefined && App.connectedUserDataBase?.ListContratsUid !== null){
        this.tousMesContrats = []
        for (let contratUid of App.connectedUserDataBase.ListContratsUid) {
          const contrat = await this.handlerContract.obtenirUnContrat(undefined,contratUid);
          if(!this.tousMesContrats.find(contrat => contrat.Id === contrat.Id)){
            this.tousMesContrats.push(contrat!);
          }          
        }
      }
    }    
  }


  toggleAddContractForm() {
    this.showAddContractForm = !this.showAddContractForm;
  }

  async enregistrerContrat(formValue: any) {
    const contrat = formValue as Contract;

    contrat.IdCreator = App.connectedUserUid;

    await this.handlerContract.sauvegarderContrat(contrat);
    this.tousMesContrats.push(contrat);
    this.showAddContractForm = false;
  }

  async updateContract(contrat: Contract) {
    if (!this.selectedContract) return;

    await this.handlerContract.updateContrat(contrat)
    const index = this.tousMesContrats.findIndex(i => i.Id === contrat.Id)
    this.tousMesContrats[index] = contrat
    this.closeEditModal();
  }

  attribuerContrat(contrat: Contract) {
    // Ouvrir le modal d'attribution
    this.contractToAssign = contrat;
    this.assignTeacherId = '';
    this.assignError = '';
    this.showAssignModal = true;
  }

  closeAssignModal() {
    this.showAssignModal = false;
    this.contractToAssign = null;
    this.assignTeacherId = '';
    this.assignError = '';
  }

  async confirmAssign() {
    if (!this.contractToAssign) return;
    if (!this.assignTeacherId || this.assignTeacherId.trim() === '') {
      this.assignError = "Veuillez saisir l'ID de l'enseignant.";
      return;
    }

    // Mettre à jour le contrat
    try {
      this.contractToAssign.IdAttributedTo = this.assignTeacherId.trim();
      await this.handlerContract.updateContrat(this.contractToAssign);
      const index = this.tousMesContrats.findIndex(c => c.Id === this.contractToAssign!.Id);
      if (index !== -1) {
        this.tousMesContrats[index] = this.contractToAssign!;
      }

      //Mettre à jour l'enseignant

      var teacher =await this.handlerEnseignant.getTeacherInfo(this.contractToAssign.IdAttributedTo);
      if(teacher.ListContratsUid === undefined || teacher.ListContratsUid === null){
        teacher.ListContratsUid = [];
      }
      teacher.ListContratsUid.push(`${App.connectedUserUid}/${this.contractToAssign.Id}`);
      await this.handlerEnseignant.updateTeacher(teacher);     


      this.closeAssignModal();
      try { this.cdr.detectChanges(); } catch (e) {}
    }
    catch (error) {
      this.assignError = "Erreur lors de l'attribution. Réessayez.";
    }
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

  async AccepterContrat(contrat: Contract) {
    contrat.isAccepted = true;
    await this.handlerContract.updateContrat(contrat,`${contrat.IdCreator}/${contrat.Id}`);
  }

  async RefuserContrat(contrat: Contract) {
    contrat.IdAttributedTo = '';
    contrat.isAccepted = false;
    const indexContrat =App.connectedUserDataBase?.ListContratsUid.findIndex(c=> c === `${contrat.IdCreator}/${contrat.Id}`);
    App.connectedUserDataBase?.ListContratsUid.splice(indexContrat!,1);
    await this.handlerContract.updateContrat(contrat,`${contrat.IdCreator}/${contrat.Id}`);
    await this.handlerEnseignant.updateTeacher(App.connectedUserDataBase! as Teacher);
    this.tousMesContrats = this.tousMesContrats.filter(c => c.Id !== contrat.Id);
    
  }

  ngOnDestroy() {
    if (this.contratSubscription) {
      this.contratSubscription.unsubscribe();
    }
  }

}