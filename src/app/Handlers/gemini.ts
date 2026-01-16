import { Injectable } from '@angular/core';
import { getAI, getGenerativeModel, GoogleAIBackend } from "firebase/ai"

@Injectable({
  providedIn: 'root',
})
export class Gemini {
  // Initialize the Gemini Developer API backend service
  ai = getAI();
  // Create a `GenerativeModel` instance with a model that supports your use case
  model = getGenerativeModel(this.ai, { model: "gemini-2.5-flash" });

  async run(prompt: string) : Promise<string> {
    // To generate text output, call generateContent with the text input
    const chat = await this.model.startChat();

    const result = await chat.sendMessage(prompt);
    const text = result.response.text();
    return text;
  }
  
}
