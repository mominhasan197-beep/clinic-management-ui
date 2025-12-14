// src/app/pages/treatment-detail/treatment-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TreatmentService } from '../../services/treatment.service';
import { Treatment } from '../../models/treatment.model';

@Component({
  selector: 'app-treatment-detail',
  templateUrl: './treatment-detail.component.html',
  styleUrls: ['./treatment-detail.component.scss']
})
export class TreatmentDetailComponent implements OnInit {
  treatment: Treatment | undefined;

  constructor(
    private route: ActivatedRoute,
    private treatmentService: TreatmentService
  ) { }

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    this.treatmentService.getTreatmentBySlug(slug).subscribe(data => {
      this.treatment = data;
    });
  }
}
