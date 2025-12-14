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

  constructor(private treatmentService: TreatmentService) { }

  ngOnInit(): void {
    this.treatmentService.getTreatments().subscribe(data => {
      this.treatments = data;
    });
  }

  ngAfterViewInit(): void {
    AOS.init({
      duration: 1000,
      once: true
    });
  }
}
