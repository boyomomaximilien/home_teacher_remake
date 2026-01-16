import { Component, inject,  } from '@angular/core';
import { Gemini } from '../Handlers/gemini';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-gemini-ai',
  imports: [FormsModule],
  templateUrl: './gemini-ai.html',
  styleUrl: './gemini-ai.css',
})
export class GeminiAI {
  
  geminiService;
  prompt!:string

  conversationLog: string[] = [];
  
  constructor(){
    this.geminiService = inject(Gemini);
  }

  async envoyerPrompt(){
    this.conversationLog.push(`User : ${this.prompt}`);
    const response = await this.geminiService.run(this.prompt);
    this.conversationLog.push(`Assistant : ${response}`);
  }

}
