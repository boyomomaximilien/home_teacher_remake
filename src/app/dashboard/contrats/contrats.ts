import { Component } from '@angular/core';
import { Contract } from '../../Models/contract';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contrats',
  imports: [CommonModule],
  templateUrl: './contrats.html',
  styleUrl: './contrats.css'
})
export class Contrats {
  Contracts: Contract[] = [];
  contrat = new Contract('kdfd7dm', 'Bekono Ange', 'Bekono Jean', ['dimanche', 'lundi', 'samedi'], 2, '4 eme', 65000, new Date('2025-12-20'));

  isMobile = false;
  activeIndex: number | null = null;

  constructor() {
    this.Contracts.push(this.contrat);
    this.Contracts.push(this.contrat);
    this.Contracts.push(this.contrat);
    this.Contracts.push(this.contrat);
    this.checkMobile();
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
