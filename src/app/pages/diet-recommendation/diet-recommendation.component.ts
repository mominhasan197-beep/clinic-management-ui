import { Component, OnInit } from '@angular/core';
import { GeminiService } from '../../services/gemini.service';
import { DisclaimerService } from '../../services/disclaimer.service';

@Component({
  selector: 'app-diet-recommendation',
  templateUrl: './diet-recommendation.component.html',
  styleUrls: ['./diet-recommendation.component.css']
})
export class DietRecommendationComponent implements OnInit {
  disclaimerAccepted = false;

  conditions: string[] = [
    'Back Pain',
    'Knee Pain',
    'Arthritis',
    'Post-Surgery Recovery',
    'Sports Injury',
    'Neck Pain',
    'Sciatica',
    'Osteoporosis'
  ];

  goals: string[] = [
    'Reduce Inflammation',
    'Improve Recovery',
    'Build Strength',
    'Lose Weight',
    'Gain Weight',
    'Maintain Energy'
  ];

  dietTypes: string[] = ['Vegetarian', 'Non-Vegetarian'];

  selectedCondition: string = '';
  selectedDietType: string = '';
  selectedGoal: string = '';

  dietPlan: any[] = [];
  loading = false;
  errorMessage: string = '';

  // Unique key for this feature
  private featureKey = 'diet-ai';

  constructor(
    private geminiService: GeminiService,
    private ds: DisclaimerService
  ) {}

  ngOnInit() {
    // Initialize disclaimerAccepted from localStorage via DisclaimerService
    this.disclaimerAccepted = this.ds.hasAccepted(this.featureKey);
  }

  onDisclaimerAccepted() {
    this.disclaimerAccepted = true;
  }

  generatePlan() {
    if (!this.selectedCondition || !this.selectedDietType || !this.selectedGoal) {
      alert('⚠️ Please select all options.');
      return;
    }

    // Reset previous plan & errors
    this.dietPlan = [];
    this.errorMessage = '';
    this.loading = true;

    this.geminiService
      .getDietPlan(this.selectedCondition, this.selectedDietType, this.selectedGoal)
      .subscribe({
        next: (res: any) => {
          try {
            const rawText = res?.candidates?.[0]?.content?.parts?.[0]?.text || '';
            if (!rawText.trim()) throw new Error('Empty response from API');

            const cleaned = rawText.replace(/```json|```/g, '').trim();
            const parsed = JSON.parse(cleaned);

            this.dietPlan = Array.isArray(parsed) ? parsed : [parsed];
          } catch (e) {
            console.error('Parsing error:', e);
            this.errorMessage = '❌ Could not generate a valid plan. Please try again.';
            this.dietPlan = [];
          }
          this.loading = false;
        },
        error: (err) => {
          console.error('API error:', err);
          this.errorMessage = '⚠️ Failed to fetch diet plan. Please try again later.';
          this.dietPlan = [];
          this.loading = false;
        }
      });
  }
}
