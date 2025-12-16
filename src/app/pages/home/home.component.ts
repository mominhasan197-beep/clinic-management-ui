import AOS from 'aos';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { DoctorService } from '../../services/doctor.service';

import { Doctor } from '../../models/doctor.model';
import { SeoService } from '../../services/seo.service';
import { SchemaService } from '../../services/schema.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements AfterViewInit, OnInit {
  doctors: Doctor[] = [];

  constructor(
    private doctorService: DoctorService,
    private seoService: SeoService,
    private schemaService: SchemaService
  ) { }

  ngOnInit(): void {
    this.seoService.updateTitle('Best Physiotherapy Clinic in Mumbai & Bhiwandi | Dr. Salim');
    this.seoService.updateMetaTags([
      { name: 'description', content: 'Leading physiotherapy clinic in Nagpada (Mumbai) and Bhiwandi. Dr. Salim offers expert rehab, sports injury treatment, and pain management.' },
      { name: 'keywords', content: 'Physiotherapy, Physiotherapist, Mumbai, Nagpada, Bhiwandi, Dr Salim, Rehabilitation, Sports Injury, Back Pain' }
    ]);
    this.seoService.setCanonicalURL();
    this.schemaService.setJsonLd(this.schemaService.getValues());
    this.doctorService.getDoctors().subscribe(doctors => {
      this.doctors = doctors;
    });
  }

  ngAfterViewInit(): void {
    AOS.init({
      duration: 1000,
      once: true
    });
  }
}
