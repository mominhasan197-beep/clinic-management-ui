import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-treatment-finder',
  templateUrl: './treatment-finder.component.html',
  styleUrls: ['./treatment-finder.component.css']
})
export class TreatmentFinderComponent implements OnInit {
  quizForm!: FormGroup;
  recommendation: string | null = null;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.quizForm = this.fb.group({
      painLocation: ['', Validators.required],
      duration: ['', Validators.required],
      severity: ['', Validators.required],
    });
  }

  getRecommendation() {
    if (this.quizForm.valid) {
      const { painLocation, duration, severity } = this.quizForm.value;

      // Simple logic example:
      if (painLocation === 'back' && severity === 'high') {
        this.recommendation = 'Manual Therapy + Exercise Therapy';
      } else if (painLocation === 'neck') {
        this.recommendation = 'Posture Correction + Manual Therapy';
      } else {
        this.recommendation = 'General Physiotherapy';
      }
    }
  }
}
