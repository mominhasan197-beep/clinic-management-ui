import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DisclaimerService {
  private storageKey = 'app_disclaimers';

  private read(): Record<string, boolean> {
    try { return JSON.parse(localStorage.getItem(this.storageKey) || '{}'); }
    catch { return {}; }
  }

  private write(map: Record<string, boolean>) {
    localStorage.setItem(this.storageKey, JSON.stringify(map));
  }

  hasAccepted(featureKey: string): boolean {
    return !!this.read()[featureKey];
  }

  accept(featureKey: string): void {
    const map = this.read();
    map[featureKey] = true;
    this.write(map);
  }

  reset(featureKey: string): void {
    const map = this.read();
    delete map[featureKey];
    this.write(map);
  }
}
