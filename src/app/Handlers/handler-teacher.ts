import { AngularFireList, AngularFireDatabase } from '@angular/fire/compat/database';
import { inject, Injectable } from '@angular/core';
import { App } from '../app';
import { Teacher } from '../Models/teacher';
import { Database, ref, get, set } from '@angular/fire/database';

@Injectable({
    providedIn: 'root'
})

export class HandlerTeacher {

    private teacherData = inject(Database);
    private pathTeacher!: string;
    private refTeacherDatabase: any;

    constructor() {

    }

    initialiserTableTeacher() {
        this.pathTeacher = `teacher/${App.connectedUserUid}`;
        this.refTeacherDatabase = ref(this.teacherData, this.pathTeacher);
    }


    async saveTeacher(enseignant: Teacher) {

        debugger;
        try {
            await set(this.refTeacherDatabase, enseignant);
            console.log(`Client sauvegardé avec succès : ${enseignant.Name}`);
        }
        catch (error) {
            console.error('Erreur lors de la sauvegarde du client :', error);
        }
    }

    async getTeacherInfo() {
        this.initialiserTableTeacher()
        const result = await get(this.refTeacherDatabase);
        return result.val() as Teacher;

    }



}

