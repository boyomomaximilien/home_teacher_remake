import { inject, Injectable } from '@angular/core';
import { App } from '../app';
import { Teacher } from '../Models/teacher';
import { Database, ref, get, set } from '@angular/fire/database';
import { Contract } from '../Models/contract';

@Injectable({
    providedIn: 'root'
})

export class HandlerTeacher {

    private teacherData = inject(Database);
    private pathTeacher!: string;
    private refTeacherDatabase: any;
    tousLesEnseignants: Teacher[] = []

    constructor() {

    }

    initialiserTableTeacher() {
        this.pathTeacher = `enseignants/${App.connectedUserUid}`;
        this.refTeacherDatabase = ref(this.teacherData, this.pathTeacher);
    }


    async saveTeacher(enseignant: Teacher) {
        this.initialiserTableTeacher()
        try {
            await set(this.refTeacherDatabase, enseignant);
            console.log(`Client sauvegardé avec succès : ${enseignant.Name}`);
        }
        catch (error) {
            console.error('Erreur lors de la sauvegarde du client :', error);
        }
    }

    async getTeacherInfo(Id?: string) {
        if (Id) {
            this.pathTeacher = `enseignants/${Id}`;
            this.refTeacherDatabase = ref(this.teacherData, this.pathTeacher);
        }
        else {
            this.initialiserTableTeacher()
        }

        const result = await get(this.refTeacherDatabase);
        return result.val() as Teacher;

    }

    async getTousLesEnseignants(): Promise<Teacher[]> {
        this.refTeacherDatabase = ref(this.teacherData, `enseignants`);
        const result = (await get(this.refTeacherDatabase)).val() as Record<string, Teacher>
        const result2 = Object.values<Teacher>(result)
        result2.forEach(element => {
            if (!this.tousLesEnseignants.find(contrat => contrat.Id === element.Id)) {
                this.tousLesEnseignants.push(element)
            }
            else {
                const index = this.tousLesEnseignants.findIndex(contrat => contrat.Id === element.Id)
                this.tousLesEnseignants[index] = element
            }
        })
        return this.tousLesEnseignants;
    }



}

