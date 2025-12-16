import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeoService } from '../../services/seo.service';
import { ImageOptimizerService } from '../../services/image-optimizer.service';

interface Machine {
    name: string;
    description: string;
    image: string;
    category: 'Therapy' | 'Rehab' | 'Cupping' | 'Fitness' | 'Neuro';
    optimized?: any;
}




@Component({
    selector: 'app-machines-available',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './machines-available.component.html',
    styles: []
})
export class MachinesAvailableComponent implements OnInit {
    activeCategory: string = 'All';

    categories = ['All', 'Therapy', 'Rehab', 'Cupping', 'Fitness', 'Neuro'];

    machines: Machine[] = [
        // Therapy Machines
        {
            name: 'Ultrasound Therapy',
            description: 'Uses sound waves to penetrate deep tissues, reducing pain and inflammation while promoting tissue healing.',
            image: 'assets/machines/ultrasound.png', // Generated
            category: 'Therapy'
        },
        {
            name: 'Acupressure',
            description: 'Stimulates pressure points to relieve muscle tension and improve blood circulation.',
            image: 'assets/machines/Acupressure.png',
            category: 'Therapy'
        },
        {
            name: 'Traction Machine',
            description: 'Gently stretches the spine to relieve pressure on compressed nerves and discs.',
            image: 'assets/machines/Traction_Machine.png',
            category: 'Therapy'
        },
        {
            name: 'PEMF Therapy',
            description: 'Pulsed Electromagnetic Field therapy to recharge cells and accelerate recovery.',
            image: 'assets/machines/PEMF-Therapy.png',
            category: 'Therapy'
        },
        {
            name: 'IFT & Sports Therapy',
            description: 'Interferential Therapy for deep pain relief and muscle stimulation.',
            image: 'assets/machines/IFT.png',
            category: 'Therapy'
        },
        {
            name: 'Rapid Release Therapy',
            description: 'High-speed vibration technology to break up scar tissue and relieve chronic pain.',
            image: 'assets/machines/Rapid-Release-Therapy.png',
            category: 'Therapy'
        },
        {
            name: 'Dry Needling',
            description: 'Targeted therapy for myofascial trigger points to release muscle tightness.',
            image: 'assets/machines/Dry-Needling.png',
            category: 'Therapy'
        },
        {
            name: 'Wax Bath',
            description: 'Warm paraffin wax therapy to soothe aching joints and soften skin.',
            image: 'assets/machines/Wax-Bath.png',
            category: 'Therapy'
        },
        {
            name: 'Hydrocollator',
            description: 'Moist heat therapy packs to relax muscles and improve circulation.',
            image: 'assets/machines/Hydrocollator.png',
            category: 'Therapy'
        },
        {
            name: 'Chest Percussion Vibration',
            description: 'Helps loosen mucus in the lungs for easier breathing and respiratory health.',
            image: 'assets/machines/Chest-Percussion-Vibration.png',
            category: 'Therapy'
        },

        // Rehab Machines
        {
            name: 'Robotic Hand Rehab',
            description: 'Advanced robotic assistance to restore hand function and finger mobility after stroke or injury.',
            image: 'assets/machines/robotic_hand.png', // Generated
            category: 'Rehab'
        },
        {
            name: 'Spinal Decompression Bed',
            description: 'Non-surgical computerized traction for severe back and neck pain relief.',
            image: 'assets/machines/spinal_decompression.png', // Generated
            category: 'Rehab'
        },
        {
            name: 'Shoulder & Limb Machine',
            description: 'Comprehensive exercise station for strengthening shoulder, elbow, wrist, and ankle joints.',
            image: 'assets/machines/Shoulder-&-Limb-Machine.png',
            category: 'Rehab'
        },
        {
            name: 'Double Knee & Calf Machine',
            description: 'Specialized equipment for strengthening knee and calf muscles post-surgery.',
            image: 'assets/machines/Double-Knee-&-Calf-Machine.png',
            category: 'Rehab'
        },
        {
            name: 'Mobilizer',
            description: 'Passive movement device to improve joint range of motion.',
            image: 'assets/machines/Mobilizer.png',
            category: 'Rehab'
        },
        {
            name: 'Spine Adjuster',
            description: 'Precise instrument for spinal alignment and mobility.',
            image: 'assets/machines/Spine-Adjuster.png',
            category: 'Rehab'
        },

        // Cupping
        {
            name: 'Smart Cupping',
            description: 'Modern cupping therapy with adjustable suction and heat for pain relief.',
            image: 'assets/machines/smart_cupping.png',
            category: 'Cupping'
        },
        {
            name: 'Fire / Dry / Wet Cupping',
            description: 'Traditional and modern cupping techniques (Hijama) for detoxification and circulation.',
            image: 'assets/machines/fire_cupping.png',
            category: 'Cupping'
        },

        // Fitness
        {
            name: 'Home Gym Setup',
            description: 'Complete resistance training station for full-body strength rehabilitation.',
            image: 'assets/machines/Home-Gym-Setup.png',
            category: 'Fitness'
        },
        {
            name: 'Crosstrainer & Recumbent Bike',
            description: 'Cardio equipment designed for low-impact joint conditioning.',
            image: 'assets/machines/Crosstrainer_&_Recumbent_Bike.png',
            category: 'Fitness'
        },
        {
            name: 'DVT Machine',
            description: 'Deep Vein Thrombosis prevention therapy to improve circulation in legs.',
            image: 'assets/machines/DVT-Machine.png',
            category: 'Fitness'
        },

        // Neuro
        {
            name: 'Face Paralysis Machine',
            description: 'Electrical stimulation to retrain facial muscles affected by Bell\'s Palsy.',
            image: 'assets/machines/Face_Paralysis_Machine.png',
            category: 'Neuro'
        },
        {
            name: 'Magnetic Glasses',
            description: 'Therapeutic eyewear using magnetic fields for eye strain and headache relief.',
            image: 'assets/machines/Magnetic_Glasses.png',
            category: 'Neuro'
        },
        {
            name: 'I-Theracare Device',
            description: 'Terahertz frequency therapy to improved cellular health and microcirculation.',
            image: 'assets/machines/I-Theracare_Device.png',
            category: 'Neuro'
        }
    ];

    filteredMachines: Machine[] = [];

    constructor(private seoService: SeoService, private imageOptimizer: ImageOptimizerService) { }

    ngOnInit(): void {
        this.seoService.updateTitle('Advanced Physiotherapy Machines Available | Dr. Salim');
        this.seoService.updateMetaTags([
            { name: 'description', content: 'Explore our state-of-the-art physiotherapy equipment including Robotic Hand Rehab, Spinal Decompression, Ultrasound, and Laser Therapy available at Dr. Salim\'s clinic.' },
            { name: 'keywords', content: 'Physiotherapy machines, Robotic rehab, Spinal decompression, Laser therapy, Medical equipment' }
        ]);

        this.imageOptimizer.getManifest().subscribe(manifest => {
            if (manifest) {
                this.machines.forEach(m => {
                    m.optimized = this.imageOptimizer.getSourcesFor(m.image);
                });
            }
            this.filterMachines();
        });
    }

    setCategory(cat: string) {
        this.activeCategory = cat;
        this.filterMachines();
    }

    filterMachines() {
        if (this.activeCategory === 'All') {
            this.filteredMachines = this.machines;
        } else {
            this.filteredMachines = this.machines.filter(m => m.category === this.activeCategory);
        }
    }
}
