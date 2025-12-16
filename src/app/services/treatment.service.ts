import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Treatment } from '../models/treatment.model';

@Injectable({
  providedIn: 'root'
})
export class TreatmentService {
  private treatments: Treatment[] = [
    // Advanced Rehabilitation Programs
    {
      id: 1,
      title: 'Advance Neuro Rehabilitation',
      slug: 'neuro-rehabilitation',
      category: 'Rehabilitation',
      description: 'Specialized care for neurological conditions including stroke, spinal cord injury, and Parkinson’s. We focus on neuroplasticity and functional recovery.',
      benefits: ['Stroke & Paralysis recovery', 'Balance & coordination training', 'Spinal cord injury support', 'Parkinson’s management'],
      image: 'assets/treatments/Advance-Neuro-Rehabilitation.png'
    },
    {
      id: 2,
      title: 'Advance Orthopedic Rehabilitation',
      slug: 'orthopedic-rehabilitation',
      category: 'Rehabilitation',
      description: 'Comprehensive rehab for fractures, joint replacements, and musculoskeletal surgeries. Restore range of motion, strength, and function.',
      benefits: ['Post-surgical recovery', 'Fracture management', 'Joint mobility', 'Strength building'],
      image: 'assets/treatments/Advance-Orthopedic-Rehabilitation.png'
    },
    {
      id: 3,
      title: 'Advance Sports Rehabilitation',
      slug: 'sports-rehabilitation',
      category: 'Rehabilitation',
      description: 'Elite-level care for sports injuries. From ACL rehab to muscle strains, we help athletes return to play stronger and safer.',
      benefits: ['ACL & Ligament recovery', 'Muscle strain treatment', 'Return-to-sport testing', 'Performance enhancement'],
      image: 'assets/treatments/Advance-Sports-Rehabilitation.png'
    },
    {
      id: 4,
      title: 'Advance Cardiac & Chest Rehabilitation',
      slug: 'cardiac-chest-rehabilitation',
      category: 'Rehabilitation',
      description: 'Expert respiratory and cardiac support for post-op recovery and chronic conditions. Improve lung function and cardiovascular endurance.',
      benefits: ['Post-CABG recovery', 'COPD management', 'Improved endurance', 'Heart health monitoring'],
      image: 'assets/treatments/Advance-Cardiac-&-Chest-Rehabilitation.png'
    },
    {
      id: 5,
      title: 'Advance Pediatric Rehabilitation',
      slug: 'pediatric-rehabilitation',
      category: 'Rehabilitation',
      description: 'Compassionate therapy for children with developmental delays, CP, and congenital conditions. We make therapy fun and effective.',
      benefits: ['Developmental milestones', 'Cerebral Palsy care', 'Motor skills training', 'Strength & coordination'],
      image: 'assets/treatments/Advance-Pediatric-Rehabilitation.png' // Utilizing the therapy setting image
    },
    {
      id: 6,
      title: 'All Types of Paralysis Rehabilitation',
      slug: 'paralysis-rehabilitation',
      category: 'Rehabilitation',
      description: 'Dedicated programs for hemiplegia, paraplegia, and quadriplegia. We use advanced techniques to maximize independence.',
      benefits: ['Gait training', 'Muscle re-education', 'Spasticity management', 'Functional independence'],
      image: 'assets/treatments/All-Types-of-Paralysis-Rehabilitation.png'
    },

    // Pain & Functional Recovery
    {
      id: 7,
      title: 'Advance Pain Management',
      slug: 'pain-management',
      category: 'Pain Relief',
      description: 'Multi-modal approach to chronic and acute pain. We treat the root cause using manual therapy, modalities, and exercises.',
      benefits: ['Chronic back/neck pain', 'Arthritis relief', 'Sciatica treatment', 'Myofascial release'],
      image: 'assets/treatments/Advance-Pain-Management.png'
    },
    {
      id: 8,
      title: 'Exercise & Movement Therapy',
      slug: 'movement-therapy',
      category: 'Pain Relief',
      description: 'Restoring natural movement patterns through corrective exercises. Ideal for posture correction and chronic stiffness.',
      benefits: ['Posture correction', 'Flexibility improvement', 'Movement efficiency', 'Injury prevention'],
      image: 'assets/treatments/Exercise-&-Movement-Therapy.png'
    },

    // Exercise & Special Programs
    {
      id: 9,
      title: 'Pilates (Muscle Activation)',
      slug: 'pilates',
      category: 'Special Programs',
      description: 'Clinical Pilates for core stability, spinal alignment, and muscle re-education. Perfect for back pain and postural issues.',
      benefits: ['Core strengthening', 'Spine alignment', 'Muscle toning', 'Flexibility'],
      image: 'assets/treatments/Pilates-(Muscle-Activation).png'
    },
    {
      id: 10,
      title: 'Antenatal & Postnatal Exercises',
      slug: 'antenatal-postnatal',
      category: 'Women\'s Health',
      description: 'Safe, guided exercises for expectant and new mothers. Relieve back pain, strengthen pelvic floor, and prepare for labor.',
      benefits: ['Pregnancy pain relief', 'Pelvic floor strength', 'Diastasis recti recovery', 'Safe fitness'],
      image: 'assets/treatments/Antenatal-&-postnatal-Exercises.png'
    },
    {
      id: 11,
      title: 'Kegel Exercises',
      slug: 'kegel-exercises',
      category: 'Women\'s Health',
      description: 'Evidence-based pelvic floor training for incontinence and organ prolapse prevention. Discreet and effective.',
      benefits: ['Bladder control', 'Core stability', 'Prolapse prevention', 'Post-childbirth recovery'],
      image: 'assets/treatments/Kegel-Exercises.png'
    },
    {
      id: 12,
      title: 'Exercises for Diabetic Patients',
      slug: 'diabetic-exercises',
      category: 'Special Programs',
      description: 'Medically supervised exercise plans to help manage blood sugar levels, improve circulation, and prevent neuropathy.',
      benefits: ['Blood sugar control', 'Weight management', 'Circulation improvement', 'Neuropathy prevention'],
      image: 'assets/treatments/Exercises_for_Diabetic_Patients.png'
    },

    // Fitness & Lifestyle
    {
      id: 13,
      title: 'Personalised Weight Loss Program',
      slug: 'weight-loss',
      category: 'Fitness',
      description: 'Science-backed weight loss strategies combining physiotherapy, exercise, and lifestyle modification.',
      benefits: ['Metabolic boost', 'Sustainable fat loss', 'Joint-friendly cardio', 'Muscle retention'],
      image: 'assets/treatments/Personalised-Weight-Loss-Program.png'
    },
    {
      id: 14,
      title: 'Personalised Fitness Plan',
      slug: 'fitness-plan',
      category: 'Fitness',
      description: 'Customized workout routines designed by physiotherapists to meet your specific health goals safely.',
      benefits: ['Goal-specific training', 'Injury-free workouts', 'Endurance building', 'Functional strength'],
      image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=600&fit=crop&q=80'
    },
    // Recovery & Wellness
    {
      id: 15,
      title: 'Ice Bath Therapy',
      slug: 'ice-bath-therapy',
      category: 'Recovery & Wellness',
      description: 'Accelerate muscle recovery and reduce inflammation with professional cold immersion therapy. Ideal for athletes and post-workout recovery.',
      benefits: ['Reduced inflammation', 'Faster muscle recovery', 'Improved circulation', 'Pain relief'],
      image: 'assets/treatments/IceBath.png'
    },
    {
      id: 16,
      title: 'Sauna Therapy',
      slug: 'sauna-therapy',
      category: 'Recovery & Wellness',
      description: 'Detoxify and relax with our premium sauna sessions. Improves cardiovascular health, skin condition, and stress levels.',
      benefits: ['Detoxification', 'Stress relief', 'Cardiovascular support', 'Skin rejuvenation'],
      image: 'assets/treatments/Sauna_Therapy.png'
    },
    {
      id: 17,
      title: 'Steam Shower Therapy',
      slug: 'steam-shower',
      category: 'Recovery & Wellness',
      description: 'Rejuvenating steam therapy to open airways, cleanse skin, and promote deep relaxation.',
      benefits: ['Respiratory clear-up', 'Pore cleansing', 'Muscle relaxation', 'Joint stiffness relief'],
      image: 'assets/treatments/Steam_shower.png'
    }
  ];

  constructor() { }

  getTreatments(): Observable<Treatment[]> {
    return of(this.treatments);
  }

  getTreatmentById(id: number): Observable<Treatment | undefined> {
    return of(this.treatments.find(treatment => treatment.id === id));
  }

  getTreatmentBySlug(slug: string | null): Observable<Treatment | undefined> {
    return of(this.treatments.find(treatment => treatment.slug === slug));
  }

  getTreatmentsByCategory(category: string): Observable<Treatment[]> {
    return of(this.treatments.filter(treatment => treatment.category === category));
  }
}
