import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SeoService } from '../../../services/seo.service';
import { SchemaService } from '../../../services/schema.service';

@Component({
    selector: 'app-location-nagpada',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './location-nagpada.component.html',
    styles: []
})
export class LocationNagpadaComponent implements OnInit {

    constructor(private seoService: SeoService, private schemaService: SchemaService) { }

    ngOnInit(): void {
        this.seoService.updateTitle('Best Physiotherapy Clinic in Nagpada, Mumbai | Dr. Salim');
        this.seoService.updateMetaTags([
            { name: 'description', content: 'Looking for the best physiotherapy clinic in Nagpada? Dr. Salim provides expert physiotherapy treatments, pain management, and rehabilitation services in Nagpada, Mumbai.' },
            { name: 'keywords', content: 'Physiotherapy clinic in Nagpada, Best physiotherapy clinic in Nagpada, Physiotherapist near me, Dr Salim physiotherapy, Sports injury Nagpada' }
        ]);
        this.seoService.setCanonicalURL();

        this.schemaService.setJsonLd({
            "@context": "https://schema.org",
            "@type": "Physiotherapy",
            "name": "Dr. Salim's Physiotherapy Clinic - Nagpada",
            "image": "assets/images/clinic-nagpada.jpg",
            "url": "https://advancephysiotherapy.com/locations/nagpada",
            "telephone": "+919136666666",
            "address": {
                "@type": "PostalAddress",
                "streetAddress": "Nagpada, Mumbai", // Update with exact address if available
                "addressLocality": "Mumbai",
                "addressRegion": "MH",
                "postalCode": "400008",
                "addressCountry": "IN"
            },
            "geo": {
                "@type": "GeoCoordinates",
                "latitude": "18.9647",
                "longitude": "72.8258"
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
