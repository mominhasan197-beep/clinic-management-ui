import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeoService } from '../../services/seo.service';

interface ClinicLocation {
    name: string;
    address: string[];
    googleMapsUrl: string;
}

@Component({
    selector: 'app-locations',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './locations.component.html',
    styles: []
})
export class LocationsComponent implements OnInit {

    locations: ClinicLocation[] = [
        {
            name: 'Nagpada Clinic',
            address: [
                'Baitul Amaan Co-op. Hsg. Soc. Ltd.,',
                'A Wing, 1st Floor,',
                '2nd Moulana Azad Road,',
                'Above Cafe Sagar Hotel,',
                'Nagpada, Mumbai – 400 008'
            ],
            googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Baitul+Amaan+Co-op+Hsg+Soc+Ltd+Nagpada+Mumbai'
        },
        {
            name: 'Bhiwandi Clinic',
            address: [
                '590 Noor Mansion,',
                'Behind Silver Medical Store,',
                'Dhamankar Naka,',
                'Bhiwandi – 421302'
            ],
            googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=590+Noor+Mansion+Dhamankar+Naka+Bhiwandi'
        }
    ];

    constructor(private seoService: SeoService) { }

    ngOnInit(): void {
        this.seoService.updateTitle('Our Clinic Locations | Advance Physiotherapy');
        this.seoService.updateMetaTags([
            { name: 'description', content: 'Visit our premium physiotherapy clinics in Nagpada and Bhiwandi. Expert care at convenient locations in Mumbai.' },
            { name: 'keywords', content: 'Physiotherapy clinic Nagpada, Physiotherapy clinic Bhiwandi, Dr. Salim clinic locations' }
        ]);
    }
}
