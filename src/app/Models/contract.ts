import { App } from "../app";

export class Contract {
    public Id!: string;
    public IdCreator = App.connectedUserUid;
    public studentName!: string;
    public studentClasse!: string;
    public studentPicture: string = 'personne_icone.png';
    public courseDay!: ('lundi' | 'mardi' | 'mercredi' | 'jeudi' | 'vendredi' | 'samedi' | 'dimanche')[];
    public sessionTime!: 1 | 2 | 3 | 4 | 5 | 6;
    public Prix!: number;
    public datePaiement !: Date;
    public matieres!: string[];
    public parentName?: string = '-----';
    public IdAttributedTo: string = '';


    constructor(student_Name: string, student_Picture: string, course_Day: ('lundi' | 'mardi' | 'mercredi' | 'jeudi' | 'vendredi' | 'samedi' | 'dimanche')[], session_Time: 1 | 2 | 3 | 4 | 5 | 6, classe: string, prix: number, date: Date, matieres: string[]) {

        this.studentName = student_Name;
        this.studentClasse = classe;
        this.studentPicture = student_Picture;
        this.courseDay = course_Day;
        this.sessionTime = session_Time;
        this.Prix = prix;
        this.datePaiement = date;
        this.matieres = matieres;

    }
}
