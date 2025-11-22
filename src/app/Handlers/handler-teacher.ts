import { AngularFireList, AngularFireDatabase } from '@angular/fire/compat/database';
import { inject } from '@angular/core';
import { App } from '../app';
import { Teacher } from '../Models/teacher';

export class HandlerTeacher {

    private teacherData = inject(AngularFireDatabase);

    constructor() {

    }

    enregistrerTeacher(teacher: Teacher) {
        return this.teacherData.list('/teachers').push(teacher);
    }


    modifierTeacher(teacher: Teacher) {
        return this.teacherData.object(`/teachers/${teacher.Id}`).update(teacher);
    }

    getTeacherInfo(teacherUid: string) {
        return this.teacherData.object(`/teachers/${teacherUid}`).valueChanges();
    }


    getMyClients() {
        this.teacherData.list(`/teacher/${App.connectedUserUid}/clients`);
    }



}

