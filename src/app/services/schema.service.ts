import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class SchemaService {

    constructor(@Inject(DOCUMENT) private _document: Document) { }

    setJsonLd(data: any): void {
        let script = this._document.querySelector('script[type="application/ld+json"]');
        if (!script) {
            script = this._document.createElement('script');
            script.setAttribute('type', 'application/ld+json');
            this._document.head.appendChild(script);
        }
        script.textContent = JSON.stringify(data);
    }

    getValues() {
        return {
            "@context": "https://schema.org",
            "@type": "MedicalClinic",
            "name": "Dr. Salim's Advance Physiotherapy & Rehab Centre",
            "image": "https://advancephysiotherapy.com/assets/logo.png", // specific details to be updated 
            "url": "https://advancephysiotherapy.com",
            "telephone": "+919136666666",
            "address": [
                {
                    "@type": "PostalAddress",
                    "streetAddress": "Nagpada Centre Address (Full)",
                    "addressLocality": "Mumbai",
                    "addressRegion": "MH",
                    "postalCode": "400008",
                    "addressCountry": "IN"
                },
                {
                    "@type": "PostalAddress",
                    "streetAddress": "Bhiwandi Centre Address (Full)",
                    "addressLocality": "Bhiwandi",
                    "addressRegion": "MH",
                    "postalCode": "421302",
                    "addressCountry": "IN"
                }
            ],
            "geo": {
                "@type": "GeoCoordinates",
                "latitude": "18.96",
                "longitude": "72.82"
            },
            "openingHoursSpecification": {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": [
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday"
                ],
                "opens": "09:00",
                "closes": "19:00"
            },
            "sameAs": [
                "https://www.facebook.com/",
                "https://www.instagram.com/"
            ]
        };
    }
}
