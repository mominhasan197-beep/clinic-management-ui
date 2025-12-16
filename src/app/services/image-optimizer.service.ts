import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable } from 'rxjs';

interface ManifestEntry {
  variants: { [key: string]: string };
  placeholder: string;
}

@Injectable({ providedIn: 'root' })
export class ImageOptimizerService {
  private manifest$ = new BehaviorSubject<{ [key: string]: ManifestEntry } | null>(null);

  constructor(private http: HttpClient) {
    this.http.get<{ [key: string]: ManifestEntry }>('assets/manifest.json')
      .subscribe(m => this.manifest$.next(m));
  }

  getManifest(): Observable<{ [key: string]: ManifestEntry } | null> {
    return this.manifest$.asObservable();
  }

  getSourcesFor(imagePath: string) {
    // imagePath is like "assets/machines/ultrasound.png"
    // We want the key "machines/ultrasound.png"

    // Remove "assets/" prefix if present
    const key = imagePath.replace(/^assets\//, '');

    const manifest = this.manifest$.value;
    if (!manifest || !manifest[key]) return null;

    const entry = manifest[key];
    // build srcset strings
    const webpSrcset = Object.entries(entry.variants)
      .filter(([k]) => k.endsWith('_webp'))
      .map(([k, v]) => `${v} ${k.split('_')[0]}w`)
      .join(', ');

    const avifSrcset = Object.entries(entry.variants)
      .filter(([k]) => k.endsWith('_avif'))
      .map(([k, v]) => `${v} ${k.split('_')[0]}w`)
      .join(', ');

    // fallback choose largest original png
    const fallback = imagePath;

    return {
      webpSrcset,
      avifSrcset,
      fallback,
      placeholder: entry.placeholder
    };
  }
}