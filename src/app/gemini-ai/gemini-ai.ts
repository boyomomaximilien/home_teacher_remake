import { Component, inject,  } from '@angular/core';
import { Gemini } from '../Handlers/gemini';
import { FormsModule } from '@angular/forms';
import { App } from '../app';

@Component({
  selector: 'app-gemini-ai',
  imports: [FormsModule],
  templateUrl: './gemini-ai.html',
  styleUrl: './gemini-ai.css',
})
export class GeminiAI {
  
  geminiService;
  prompt!:string
  nomUser = App.connectedUserDataBase?.Name

  conversationLog: string[] = [];
  
  constructor(){
    this.geminiService = inject(Gemini);
  }

  async envoyerPrompt(){
    if(this.prompt != undefined && this.prompt != null && this.prompt.trim()!==''){
        if(this.nomUser!= undefined && this.nomUser != null){
        this.conversationLog.push(`${this.nomUser} : ${this.prompt}`);
      }
      else{
        this.conversationLog.push(`User : ${this.prompt}`+'');
      }
      
      const response = await this.geminiService.run(this.prompt);
      this.conversationLog.push(`Assistant : ${response}`);
      this.prompt = '';
    }
    else{
      console.log('veuillez saisir votre prompt')
    }
      
  }

}
