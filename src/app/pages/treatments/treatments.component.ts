import { Component, OnInit } from '@angular/core';
import { TreatmentService } from '../../services/treatment.service';
import { Treatment } from '../../models/treatment.model';
import AOS from 'aos';

@Component({
  selector: 'app-treatments',
  templateUrl: './treatments.component.html',
  styleUrls: ['./treatments.component.scss']
})
export class TreatmentsComponent implements OnInit {
  treatments: Treatment[] = [];
  groupedTreatments: { [key: string]: Treatment[] } = {};
  objectKeys = Object.keys; // Helper for HTML iteration

  constructor(private treatmentService: TreatmentService) { }

  ngOnInit(): void {
    this.treatmentService.getTreatments().subscribe(data => {
      this.treatments = data;
      this.groupTreatments();
    });
  }

  groupTreatments() {
    // Custom grouping logic for the requested sections
    this.groupedTreatments = {
      'Advanced Rehabilitation Programs': this.treatments.filter(t =>
        ['Rehabilitation'].includes(t.category)
      ),
      'Pain & Functional Recovery': this.treatments.filter(t =>
        ['Pain Relief'].includes(t.category)
      ),
      'Specialized Programs': this.treatments.filter(t =>
        ['Special Programs', 'Women\'s Health'].includes(t.category)
      ),
      'Fitness & Lifestyle': this.treatments.filter(t =>
        ['Fitness'].includes(t.category)
      ),
      'Recovery & Wellness': this.treatments.filter(t =>
        ['Recovery & Wellness'].includes(t.category)
      )
    };
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      AOS.init({
        duration: 800,
        once: true,
        offset: 50
      });
      AOS.refresh();
    }, 100);
  }
}
