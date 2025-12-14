import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private API_KEY = 'AIzaSyDbrTD7r-FrsPxT2k_HvMBWieS-BqdBaiM';
  private API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

  constructor(private http: HttpClient) {}

  askGemini(prompt: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = {
      contents: [
        {
          parts: [
            { text: prompt }
          ]
        }
      ],
       generationConfig: {
        temperature: 0.3,
        topK: 20,
        topP: 0.8,
        maxOutputTokens: 1000
      }
    };
    return this.http.post(`${this.API_URL}?key=${this.API_KEY}`, body, { headers });
  }
  getRehabPlan(description: string): Observable<any> {
  const rehabPrompt = `
    You are a friendly physiotherapy assistant.
    Based on the patient input: "${description}", create a personalized rehab plan.

    Output instructions:
    1. Divide the plan into sections: Warm-up, Main Exercises, Cool-down.
    2. For each exercise, provide:
       - Name
       - Step-by-step instructions
       - Duration
       - Frequency
       - Precautions
    3. Output **strictly valid JSON** as an array of sections.
    4. Do NOT include Markdown formatting, code fences, or extra text.
    5. Use only plain JSON — no \`\`\`json or explanations.
    6. Use simple, patient-friendly language.
  `;
  return this.askGemini(rehabPrompt);
}
// ---- NEW diet & lifestyle plan ----
getDietPlan(condition: string, dietType: string, expectation: string): Observable<any> {
  const dietPrompt = `
    You are a physiotherapy-aware dietitian.
    The patient has the following details:
    - Condition: ${condition}
    - Diet Type: ${dietType}
    - Expectation: ${expectation}

    Create a personalized diet & lifestyle recommendation.

    Output instructions:
    1. Divide the plan into sections: Breakfast, Lunch, Dinner, Snacks, Lifestyle Tips.
    2. For each section, provide:
       - Recommended foods
       - Portion guidance
       - Key notes (why it's helpful for physiotherapy recovery).
    3. Output strictly valid JSON as an **array of objects** with fields:
       {
         "section": "Breakfast",
         "recommendations": [
           "Oats with milk - provides slow-releasing carbs for recovery",
           "1 boiled egg - protein for muscle repair"
         ]
       }
    4. No Markdown, no code fences, no explanations. Only valid JSON.
    5. Strictly Indian diet suggestions.
    6. Do not include trailing commas or unescaped quotes in the JSON.
  `;
  
  return this.askGemini(dietPrompt);
}

}
