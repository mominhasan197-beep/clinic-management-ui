import { Component } from '@angular/core';

interface SymptomData {
  location: string;
  symptoms: string[];
  possibleConditions: string[];
  recommendedExercises: string[];
  exerciseTips: string[];
}

@Component({
  selector: 'app-symptom-checker',
  templateUrl: './symptom-checker.component.html',
  styleUrls: ['./symptom-checker.component.css']
})
export class SymptomCheckerComponent {
  step = 1;
  selectedLocation = '';
  selectedSymptoms: string[] = [];
  
  symptomData: SymptomData[] = [
    {
      location: 'Head',
      symptoms: ['Headache', 'Dizziness', 'Blurred vision', 'Nausea', 'Sensitivity to light', 'Fatigue'],
      possibleConditions: ['Migraine', 'Tension headache', 'Concussion', 'Cluster headache', 'Sinusitis', 'Dehydration'],
      recommendedExercises: ['Neck stretches', 'Eye relaxation exercises', 'Deep breathing', 'Gentle neck rotations', 'Shoulder shrugs'],
      exerciseTips: [
        'Stay hydrated to prevent headaches.',
        'Take regular screen breaks to reduce eye strain.',
        'Practice deep breathing for relaxation.',
        'Avoid sudden head movements if dizzy.'
      ]
    },
    {
      location: 'Neck',
      symptoms: ['Neck stiffness', 'Headaches', 'Shoulder pain', 'Tingling in arms', 'Limited rotation', 'Muscle spasms'],
      possibleConditions: ['Cervical spondylosis', 'Muscle strain', 'Pinched nerve', 'Whiplash', 'Torticollis', 'Cervical disc herniation'],
      recommendedExercises: ['Chin tucks', 'Neck side bends', 'Upper trapezius stretch', 'Levator scapulae stretch', 'Shoulder rolls'],
      exerciseTips: [
        'Avoid holding your head forward for long periods.',
        'Use a supportive pillow when sleeping.',
        'Stretch gently without forcing neck movements.',
        'Take breaks from prolonged sitting.'
      ]
    },
    {
      location: 'Shoulder',
      symptoms: ['Limited movement', 'Pain at night', 'Weakness', 'Clicking sound', 'Swelling', 'Pain lifting arm'],
      possibleConditions: ['Rotator cuff injury', 'Frozen shoulder', 'Tendonitis', 'Shoulder impingement', 'Bursitis', 'Labral tear'],
      recommendedExercises: ['Pendulum swings', 'Wall slides', 'External rotations', 'Crossover arm stretch', 'Scapular squeezes'],
      exerciseTips: [
        'Warm up before lifting heavy objects.',
        'Avoid sudden overhead movements.',
        'Strengthen the rotator cuff muscles.',
        'Keep your posture upright to reduce strain.'
      ]
    },
    {
      location: 'Elbow',
      symptoms: ['Pain when gripping', 'Swelling', 'Tenderness', 'Weak grip', 'Pain on bending', 'Stiffness'],
      possibleConditions: ['Tennis elbow', 'Golfer’s elbow', 'Bursitis', 'Ligament strain', 'Arthritis', 'Tendinopathy'],
      recommendedExercises: ['Wrist extensions', 'Forearm pronation/supination', 'Towel squeeze', 'Triceps stretch'],
      exerciseTips: [
        'Avoid repetitive gripping without breaks.',
        'Use proper lifting techniques.',
        'Stretch forearm muscles regularly.',
        'Apply ice after strenuous activity.'
      ]
    },
    {
      location: 'Wrist',
      symptoms: ['Pain when bending', 'Numbness in fingers', 'Swelling', 'Weak grip', 'Tingling sensation'],
      possibleConditions: ['Carpal tunnel syndrome', 'Wrist sprain', 'Tendonitis', 'Ganglion cyst', 'Arthritis', 'Fracture'],
      recommendedExercises: ['Wrist flexor stretch', 'Wrist extensor stretch', 'Finger spreads', 'Grip strengthening'],
      exerciseTips: [
        'Avoid prolonged typing without wrist support.',
        'Perform gentle wrist stretches during breaks.',
        'Maintain neutral wrist position when working.',
        'Strengthen grip gradually.'
      ]
    },
    {
      location: 'Hand',
      symptoms: ['Joint stiffness', 'Pain when gripping', 'Swelling', 'Numbness', 'Tremors'],
      possibleConditions: ['Arthritis', 'Trigger finger', 'Tendonitis', 'Carpal tunnel syndrome', 'Dupuytren’s contracture', 'Fracture'],
      recommendedExercises: ['Finger bends', 'Thumb stretches', 'Squeeze ball', 'Finger lifts'],
      exerciseTips: [
        'Warm up hands before heavy use.',
        'Avoid prolonged gripping without breaks.',
        'Do gentle finger stretches daily.',
        'Strengthen gradually to prevent injury.'
      ]
    },
    {
      location: 'Chest',
      symptoms: ['Tightness', 'Pain when breathing', 'Shortness of breath', 'Burning sensation'],
      possibleConditions: ['Muscle strain', 'Costochondritis', 'Rib fracture', 'Pectoral tendon injury', 'Postural strain'],
      recommendedExercises: ['Chest opener stretch', 'Doorway stretch', 'Thoracic extension', 'Deep breathing exercises'],
      exerciseTips: [
        'Avoid overexertion during workouts.',
        'Practice slow, deep breathing for relaxation.',
        'Keep your posture upright.',
        'Stretch chest muscles regularly.'
      ]
    },
    {
      location: 'Back',
      symptoms: ['Lower back pain', 'Tingling in legs', 'Stiffness', 'Pain after sitting', 'Muscle spasms'],
      possibleConditions: ['Disc bulge', 'Sciatica', 'Muscle strain', 'Facet joint irritation', 'Scoliosis'],
      recommendedExercises: ['Cat-cow stretch', 'Child’s pose', 'Pelvic tilts', 'Bridge exercise', 'Bird-dog'],
      exerciseTips: [
        'Lift heavy objects using your legs, not your back.',
        'Avoid sitting for too long without moving.',
        'Strengthen core muscles for support.',
        'Stretch back muscles daily.'
      ]
    },
    {
      location: 'Hip',
      symptoms: ['Groin pain', 'Stiffness', 'Clicking sound', 'Pain when walking'],
      possibleConditions: ['Hip bursitis', 'Osteoarthritis', 'Labral tear', 'Muscle strain', 'Hip impingement'],
      recommendedExercises: ['Hip bridges', 'Clamshells', 'Hip flexor stretch', 'Side leg raises'],
      exerciseTips: [
        'Avoid sudden twisting movements.',
        'Strengthen glute and hip muscles.',
        'Stretch hip flexors regularly.',
        'Maintain good posture while standing.'
      ]
    },
    {
      location: 'Knee',
      symptoms: ['Swelling', 'Pain when bending', 'Stiffness', 'Popping sound', 'Instability'],
      possibleConditions: ['Ligament injury', 'Meniscus tear', 'Arthritis', 'Patellar tendinitis', 'Bursitis'],
      recommendedExercises: ['Quad sets', 'Heel slides', 'Straight leg raises', 'Hamstring stretches'],
      exerciseTips: [
        'Avoid deep squats if pain persists.',
        'Apply ice after activity to reduce swelling.',
        'Strengthen surrounding muscles for stability.',
        'Stretch before and after workouts.'
      ]
    },
    {
      location: 'Ankle',
      symptoms: ['Swelling', 'Bruising', 'Pain when walking', 'Instability'],
      possibleConditions: ['Ankle sprain', 'Achilles tendinitis', 'Fracture', 'Plantar fasciitis'],
      recommendedExercises: ['Ankle circles', 'Heel raises', 'Toe curls', 'Resistance band dorsiflexion'],
      exerciseTips: [
        'Wear proper footwear for support.',
        'Avoid uneven surfaces if unstable.',
        'Strengthen ankle muscles regularly.',
        'Stretch calves and Achilles tendon.'
      ]
    },
    {
      location: 'Foot',
      symptoms: ['Heel pain', 'Arch pain', 'Swelling', 'Pain after walking'],
      possibleConditions: ['Plantar fasciitis', 'Metatarsalgia', 'Stress fracture', 'Bunions'],
      recommendedExercises: ['Towel scrunches', 'Calf stretches', 'Toe raises', 'Foot rolling with ball'],
      exerciseTips: [
        'Wear supportive footwear daily.',
        'Avoid prolonged standing without rest.',
        'Stretch feet before and after walking.',
        'Massage soles to relieve tension.'
      ]
    }
  ];

  filteredSymptoms: string[] = [];
  results: { conditions: string[]; exercises: string[]; tips: string[] } | null = null;

  selectLocation(location: string) {
    this.selectedLocation = location;
    const match = this.symptomData.find(d => d.location === location);
    this.filteredSymptoms = match ? match.symptoms : [];
    this.step = 2;
  }

  toggleSymptom(symptom: string) {
    if (this.selectedSymptoms.includes(symptom)) {
      this.selectedSymptoms = this.selectedSymptoms.filter(s => s !== symptom);
    } else {
      this.selectedSymptoms.push(symptom);
    }
  }

  showResults() {
    const match = this.symptomData.find(d => d.location === this.selectedLocation);
    if (match) {
      this.results = {
        conditions: match.possibleConditions,
        exercises: match.recommendedExercises,
        tips: match.exerciseTips
      };
    }
    this.step = 3;
  }

  restart() {
    this.step = 1;
    this.selectedLocation = '';
    this.selectedSymptoms = [];
    this.filteredSymptoms = [];
    this.results = null;
  }
}
