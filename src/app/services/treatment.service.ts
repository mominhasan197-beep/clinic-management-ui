import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Treatment } from '../models/treatment.model';

@Injectable({
  providedIn: 'root'
})
export class TreatmentService {
  private treatments: Treatment[] = [
    {
      id: 1,
      title: 'Neuro Rehabilitation',
      slug: 'neuro-rehabilitation',
      category: 'Neurological',
      description: 'Restore independence and confidence with our specialized neuro rehab programs. We support recovery from stroke, spinal cord injuries, and Parkinson\'s disease using evidence-based therapies that improve mobility, coordination, and daily functioning.',
      benefits: [
        'Improved mobility and coordination',
        'Enhanced daily functioning',
        'Stroke recovery support',
        'Spinal cord injury rehabilitation'
      ],
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=600&fit=crop&q=80'
    },
    {
      id: 2,
      title: 'Orthopedic Rehabilitation',
      slug: 'orthopedic-rehabilitation',
      category: 'Orthopedic',
      description: 'Recover faster and move better with our orthopedic rehab services. From fractures to joint replacements, we focus on pain relief, joint strength, and restoring full mobility—so you can return to your daily life with confidence.',
      benefits: [
        'Pain relief',
        'Restored mobility',
        'Strengthened muscles and joints',
        'Post-surgery recovery'
      ],
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop&q=80'
    },
    {
      id: 3,
      title: 'Sports Rehabilitation',
      slug: 'sports-rehabilitation',
      category: 'Sports',
      description: 'Bounce back stronger with our expert sports rehab. Whether you\'re an athlete or weekend warrior, we help you heal from injuries, enhance performance, and prevent future setbacks through tailored, sport-specific physiotherapy.',
      benefits: [
        'Sports injury recovery',
        'Performance enhancement',
        'Injury prevention',
        'Strength and flexibility restoration'
      ],
      image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=600&fit=crop&q=80'
    },
    {
      id: 4,
      title: 'Cardiac and Chest Rehabilitation',
      slug: 'cardiac-chest-rehabilitation',
      category: 'Cardiac',
      description: 'Breathe better, live stronger—your heart and lungs in sync. Boost your respiratory health and overall wellbeing with trusted physiotherapy. Our expert guidance helps enhance circulation, increase energy, and support your path to recovery.',
      benefits: [
        'Improved cardiovascular health',
        'Enhanced respiratory function',
        'Increased stamina',
        'Better quality of life'
      ],
      image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&h=600&fit=crop&q=80'
    },
    {
      id: 5,
      title: 'Pediatric Rehabilitation',
      slug: 'pediatric-rehabilitation',
      category: 'Pediatric',
      description: 'Helping little ones move forward—one milestone at a time. Supporting children\'s growth and development through tailored therapies that encourage strength, coordination, and confidence.',
      benefits: [
        'Developmental support',
        'Improved coordination',
        'Enhanced strength',
        'Confidence building'
      ],
      image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&h=600&fit=crop&q=80'
    },
    {
      id: 6,
      title: 'Pain Management',
      slug: 'pain-management',
      category: 'Pain Relief',
      description: 'Targeted relief for lasting comfort and better living. Focused therapies designed to reduce discomfort and improve daily function. Experience personalized care that promotes healing, restores mobility, and enhances overall well-being.',
      benefits: [
        'Chronic pain relief',
        'Improved mobility',
        'Enhanced quality of life',
        'Non-invasive treatment'
      ],
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=600&fit=crop&q=80'
    },
    {
      id: 7,
      title: 'Pilates (Muscle Activation & Re-education)',
      slug: 'pilates',
      category: 'Fitness',
      description: 'Activate, align, and move with mindful precision. Engage your body through controlled movements that improve strength, balance, and posture. Enhance flexibility and coordination with focused exercises.',
      benefits: [
        'Improved strength and balance',
        'Better posture',
        'Enhanced flexibility',
        'Core muscle activation'
      ],
      image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=600&fit=crop&q=80'
    },
    {
      id: 8,
      title: 'Personalised Weight Loss Program',
      slug: 'weight-loss-program',
      category: 'Wellness',
      description: 'Lose weight the right way—with expert physiotherapy support. Achieve your goals through tailored exercise plans and ongoing guidance. Benefit from safe, sustainable strategies that boost metabolism and improve fitness.',
      benefits: [
        'Safe weight loss',
        'Improved metabolism',
        'Enhanced fitness',
        'Personalized exercise plans'
      ],
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&q=80'
    },
    {
      id: 9,
      title: 'Personalised Fitness Plan',
      slug: 'fitness-plan',
      category: 'Fitness',
      description: 'Custom fitness plans built around your goals and body. Focused on your well-being, our tailored physiotherapy and fitness plans enhance strength, flexibility, and endurance.',
      benefits: [
        'Customized fitness routines',
        'Improved strength and endurance',
        'Enhanced flexibility',
        'Sustainable results'
      ],
      image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=600&fit=crop&q=80'
    },
    {
      id: 10,
      title: 'Antenatal and Postnatal Exercises',
      slug: 'antenatal-postnatal-exercises',
      category: 'Women\'s Health',
      description: 'Specialized exercise programs to support mothers before and after childbirth. Safe, effective routines that strengthen core muscles, improve posture, and promote recovery.',
      benefits: [
        'Core muscle strengthening',
        'Improved posture',
        'Faster recovery',
        'Safe for mother and baby'
      ],
      image: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=800&h=600&fit=crop&q=80'
    },
    {
      id: 11,
      title: 'Kegel Exercises for Pelvic Floor',
      slug: 'kegel-exercises',
      category: 'Women\'s Health',
      description: 'Strengthen your pelvic floor with guided Kegel exercises. These targeted routines help improve bladder control, support core stability, and enhance quality of life.',
      benefits: [
        'Improved bladder control',
        'Enhanced core stability',
        'Better quality of life',
        'Post-childbirth recovery'
      ],
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&q=80'
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
