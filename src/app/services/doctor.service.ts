import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Doctor } from '../models/doctor.model';

@Injectable({
    providedIn: 'root'
})
export class DoctorService {
    private doctors: Doctor[] = [
        {
            id: 1,
            name: 'Dr. Salim Memon',
            qualifications: 'BPT, MPT (Neuro), MIAP',
            experience: '15+ years',
            specializations: [
                'Neuro Rehabilitation',
                'Stroke Recovery',
                'Spinal Cord Injuries',
                'Parkinson\'s Disease Management'
            ],
            description: 'Expert in neurological rehabilitation with over 15 years of experience helping patients regain independence and confidence through evidence-based therapies.',
            image: 'assets/DrSalim.jpg',
            availability: 'Mon-Sat: 9:00 AM - 7:00 PM',
            locations: ['Nagpada Centre', 'Bhiwandi Centre']
        },
        {
            id: 2,
            name: 'Dr. Sukaina Salim Memon',
            qualifications: 'BPT, MPT (Orthopedic), MIAP',
            experience: '12+ years',
            specializations: [
                'Orthopedic Rehabilitation',
                'Sports Injuries',
                'Joint Replacement Recovery',
                'Pain Management'
            ],
            description: 'Specialized in orthopedic and sports rehabilitation, helping patients recover from injuries and surgeries with personalized treatment plans.',
            image: 'assets/doctors/dr-sukaina-salim-memon.jpg',
            availability: 'Mon-Sat: 9:00 AM - 7:00 PM',
            locations: ['Nagpada Centre', 'Bhiwandi Centre']
        }
    ];

    constructor() { }

    getDoctors(): Observable<Doctor[]> {
        return of(this.doctors);
    }

    getDoctorById(id: number): Observable<Doctor | undefined> {
        return of(this.doctors.find(doctor => doctor.id === id));
    }
}
