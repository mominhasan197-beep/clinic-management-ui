import { Component } from '@angular/core';
import { GeminiService } from '../../services/gemini.service';

interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html', // external HTML file
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent {
  messages: ChatMessage[] = [];
  userInput = '';
  loading = false;

  constructor(private geminiService: GeminiService) {}

  sendMessage() {
    if (!this.userInput.trim()) return;

    this.messages.push({ sender: 'user', text: this.userInput });
    const question = this.userInput;
    this.userInput = '';
    this.loading = true;

    this.geminiService.askGemini(question).subscribe({
      next: (res) => {
        const aiText = res?.candidates[0]?.content?.parts[0]?.text || 'No response';
        this.messages.push({ sender: 'ai', text: aiText });
        this.loading = false;
      },
      error: () => {
        this.messages.push({ sender: 'ai', text: 'Error getting AI response.' });
        this.loading = false;
      }
    });
  }
}
