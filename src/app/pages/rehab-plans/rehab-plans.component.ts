import { Component, OnInit } from '@angular/core';
import { GeminiService } from '../../services/gemini.service';
import { DisclaimerService } from '../../services/disclaimer.service';

interface Exercise {
  name: string;
  instructions: string;
  duration: string;
  frequency: string;
  precautions: string;
}

interface RehabSection {
  section: string;
  exercises: Exercise[];
}

@Component({
  selector: 'app-rehab-plans',
  templateUrl: './rehab-plans.component.html',
  styleUrls: ['./rehab-plans.component.css']
})
export class RehabPlansComponent implements OnInit {
  rehabPlans: RehabSection[] = [];
  loading = false;

  selectedInjury = '';
  selectedLocation = '';
  selectedIntensity = '';
  selectedGoal = '';
  disclaimerAccepted = false;

  injuries = ['Knee', 'Shoulder', 'Back', 'Neck', 'Ankle'];
  locations: string[] = [];
  intensities = ['Low', 'Medium', 'High'];
  goals = ['Strength', 'Flexibility', 'Pain Relief', 'Rehab'];

  // Unique key for this feature
  private featureKey = 'rehab-ai';

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

  onInjuryChange() {
    if (['Knee', 'Shoulder', 'Ankle'].includes(this.selectedInjury)) {
      this.locations = ['Left', 'Right', 'Both'];
    } else {
      this.locations = [];
      this.selectedLocation = '';
    }
  }

  generatePlan() {
    if (!this.selectedInjury || !this.selectedIntensity || !this.selectedGoal) {
      alert('⚠️ Please select all required options.');
      this.rehabPlans = [];
      return;
    }

    this.rehabPlans = [];
    this.loading = true;

    const prompt = `Generate a personalized rehab plan in JSON only (no markdown).
Injury: ${this.selectedInjury}
Location: ${this.selectedLocation || 'N/A'}
Intensity: ${this.selectedIntensity}
Goal: ${this.selectedGoal}
Format: [
  {
    "section": "Warm-up",
    "exercises": [
      {
        "name": "Exercise Name",
        "instructions": "Step by step instructions",
        "duration": "e.g. 10 reps or 30s",
        "frequency": "e.g. 3 times/week",
        "precautions": "Safety notes"
      }
    ]
  }
]`;

    this.geminiService.getRehabPlan(prompt).subscribe({
      next: (res: any) => {
        let planText: string = res?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        planText = planText.replace(/```json|```/gi, '').trim();

        try {
          this.rehabPlans = JSON.parse(planText);
        } catch (err) {
          console.error('JSON parse error:', err, planText);
          this.rehabPlans = [];
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('API error:', err);
        this.rehabPlans = [];
        this.loading = false;
      }
    });
  }
}
