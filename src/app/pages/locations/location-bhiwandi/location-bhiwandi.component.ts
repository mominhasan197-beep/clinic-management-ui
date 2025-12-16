import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SeoService } from '../../../services/seo.service';
import { SchemaService } from '../../../services/schema.service';

@Component({
    selector: 'app-location-bhiwandi',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './location-bhiwandi.component.html',
    styles: []
})
export class LocationBhiwandiComponent implements OnInit {

    constructor(private seoService: SeoService, private schemaService: SchemaService) { }

    ngOnInit(): void {
        this.seoService.updateTitle('Best Physiotherapy Clinic in Bhiwandi | Dr. Salim');
        this.seoService.updateMetaTags([
            { name: 'description', content: 'Visit Dr. Salim\'s Physiotherapy Clinic in Bhiwandi for expert rehabilitation, pain management, and sports injury recovery. Trusted by hundreds in Bhiwandi.' },
            { name: 'keywords', content: 'Physiotherapy clinic in Bhiwandi, Best physiotherapy clinic in Bhiwandi, Physiotherapist in Bhiwandi, Dr Salim Bhiwandi, Back pain treatment Bhiwandi' }
        ]);
        this.seoService.setCanonicalURL();

        this.schemaService.setJsonLd({
            "@context": "https://schema.org",
            "@type": "Physiotherapy",
            "name": "Dr. Salim's Physiotherapy Clinic - Bhiwandi",
            "image": "assets/images/clinic-bhiwandi.jpg",
            "url": "https://advancephysiotherapy.com/locations/bhiwandi",
            "telephone": "+919136666666",
            "address": {
                "@type": "PostalAddress",
                "streetAddress": "Bhiwandi, Maharashtra", // Update with exact address if available
                "addressLocality": "Bhiwandi",
                "addressRegion": "MH",
                "postalCode": "421302",
                "addressCountry": "IN"
            },
            "geo": {
                "@type": "GeoCoordinates",
                "latitude": "19.29", // Approximate for Bhiwandi
                "longitude": "73.06"
            },
            "openingHoursSpecification": {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                "opens": "09:00",
                "closes": "21:00"
            },
            "priceRange": "$$"
        });
    }
}
