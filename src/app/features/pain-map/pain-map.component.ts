import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

type AreaKey =
  | 'head' | 'neck' | 'chest' | 'abdomen' | 'groin'
  | 'shoulder_left' | 'shoulder_right'
  | 'elbow_left' | 'elbow_right'
  | 'wrist_left' | 'wrist_right'
  | 'hip_left' | 'hip_right'
  | 'knee_left' | 'knee_right'
  | 'ankle_left' | 'ankle_right'
  | 'upper_back' | 'lower_back';

@Component({
  selector: 'app-pain-map',
  templateUrl: './pain-map.component.html',
  styleUrls: ['./pain-map.component.scss']
})
export class PainMapComponent {
  @Input() navigateOnClick = true;               // set false to handle selection yourself
  @Output() areaSelected = new EventEmitter<AreaKey>();

  view: 'front' | 'back' = 'front';
  hover: AreaKey | null = null;
  selected: AreaKey | null = null;

  constructor(private router: Router) {}

  toggleView() {
    this.view = this.view === 'front' ? 'back' : 'front';
    this.hover = null;
  }

  label(area: AreaKey) {
    const names: Record<AreaKey, string> = {
      head: 'Head', neck: 'Neck', chest: 'Chest', abdomen: 'Abdomen', groin: 'Groin',
      shoulder_left: 'Left Shoulder', shoulder_right: 'Right Shoulder',
      elbow_left: 'Left Elbow', elbow_right: 'Right Elbow',
      wrist_left: 'Left Wrist', wrist_right: 'Right Wrist',
      hip_left: 'Left Hip', hip_right: 'Right Hip',
      knee_left: 'Left Knee', knee_right: 'Right Knee',
      ankle_left: 'Left Ankle', ankle_right: 'Right Ankle',
      upper_back: 'Upper Back', lower_back: 'Lower Back'
    };
    return names[area];
  }

  onAreaClick(area: AreaKey) {
    this.selected = area;
    this.areaSelected.emit(area);
    if (this.navigateOnClick) {
      this.router.navigate(['/treatments'], { queryParams: { area } });
    }
  }

  onKeyActivate(e: KeyboardEvent, area: AreaKey) {
    const keys = ['Enter', ' ']; // space or enter
    if (keys.includes(e.key)) {
      e.preventDefault();
      this.onAreaClick(area);
    }
  }
}
